import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    message: "Alert preferences saved",
    preferences: {
      zipCode: body.zipCode,
      radius: body.radius,
      retailers: body.retailers,
      products: body.products,
      channels: body.channels,
    },
  });
}
