import { NextResponse } from "next/server";
import { MOCK_REPORTS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(MOCK_REPORTS);
}

export async function POST(request: Request) {
  const body = await request.json();

  const report = {
    id: `r${Date.now()}`,
    productName: body.productName,
    retailer: body.retailer,
    location: body.location,
    zipCode: body.zipCode,
    status: "in_stock" as const,
    note: body.note || "",
    reportedAt: new Date().toISOString(),
    upvotes: 0,
  };

  return NextResponse.json(report, { status: 201 });
}
