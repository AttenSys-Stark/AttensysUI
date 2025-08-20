import { NextResponse } from "next/server";

// Single config endpoint for all non-sensitive configs
export async function GET() {
  return NextResponse.json({
    gatewayUrl: process.env.GATEWAY_URL || "https://gateway.pinata.cloud",
    apiUrl: process.env.API_URL || "https://attensys-1a184d8bebe7.herokuapp.com/api",
  });
}