import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Only return the gateway URL which is safe for client-side
    // JWT should never be exposed to the client
    return NextResponse.json({
      gateway: process.env.GATEWAY_URL || "https://gateway.pinata.cloud",
    });
  } catch (error) {
    console.error("Config error:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}