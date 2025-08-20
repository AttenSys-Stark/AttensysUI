import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      gateway: process.env.GATEWAY_URL || "https://gateway.pinata.cloud",
    });
  } catch (error) {
    console.error("Gateway config error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gateway configuration" },
      { status: 500 }
    );
  }
}