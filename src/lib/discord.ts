import { StockChange } from "./scrapers";
import { RETAILER_INFO, Retailer } from "@/types";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function sendDiscordAlert(changes: StockChange[]): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    console.log("[Discord] No webhook URL configured, skipping alert");
    return;
  }

  // Only alert on items coming INTO stock
  const restocks = changes.filter(
    (c) => c.newStatus === "in_stock" && c.previousStatus !== "in_stock"
  );

  if (restocks.length === 0) return;

  const embeds = restocks.map((restock) => {
    const retailerInfo = RETAILER_INFO[restock.retailer as Retailer];
    const retailerName = retailerInfo?.name || restock.retailer;

    return {
      title: `${retailerName} - ${restock.productName}`,
      description: `**Status:** Back in stock!\n**Price:** ${restock.price ? `$${restock.price.toFixed(2)}` : "Unknown"}\n\n[Buy Now](${restock.url})`,
      color: 0x22c55e, // green
      thumbnail: {
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
      },
      footer: {
        text: `PokeRestock | ${new Date().toLocaleTimeString()}`,
      },
    };
  });

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "PokeRestock",
        avatar_url:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
        content: `🚨 **RESTOCK ALERT** — ${restocks.length} product${restocks.length > 1 ? "s" : ""} just came back in stock!`,
        embeds: embeds.slice(0, 10), // Discord max 10 embeds
      }),
    });

    if (!response.ok) {
      console.error(`[Discord] Webhook failed: ${response.status}`);
    } else {
      console.log(`[Discord] Sent ${restocks.length} restock alerts`);
    }
  } catch (error) {
    console.error("[Discord] Error sending webhook:", error);
  }
}
