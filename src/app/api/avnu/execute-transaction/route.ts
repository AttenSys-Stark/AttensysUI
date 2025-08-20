import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const avnuApiKey = process.env.AVNU_API_KEY;
    
    if (!avnuApiKey) {
      throw new Error("AVNU API key not configured");
    }

    const response = await fetch("https://starknet.api.avnu.fi/gasless/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": avnuApiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "AVNU transaction failed");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("AVNU transaction error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transaction failed" },
      { status: 500 }
    );
  }
}