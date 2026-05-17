import { NextResponse } from "next/server";
import { runStockCheck } from "@/lib/scrapers";
import { sendDiscordAlert } from "@/lib/discord";

export const maxDuration = 60; // Allow up to 60s for all checks

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runStockCheck();

    // Fire Discord alerts for any stock changes
    if (result.changes.length > 0) {
      await sendDiscordAlert(result.changes);
    }

    return NextResponse.json({
      success: true,
      checked: result.results.length,
      changes: result.changes.length,
      duration: `${result.duration}ms`,
      checkedAt: result.checkedAt,
      results: result.results,
      stockChanges: result.changes,
    });
  } catch (error) {
    console.error("[Cron] Stock check failed:", error);
    return NextResponse.json(
      { error: "Stock check failed" },
      { status: 500 }
    );
  }
}
