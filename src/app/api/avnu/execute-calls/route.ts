import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, calls, options } = body;
    
    if (!calls || !Array.isArray(calls)) {
      return NextResponse.json({ error: "Calls array required" }, { status: 400 });
    }

    const avnuApiKey = process.env.AVNU_API_KEY;
    if (!avnuApiKey) {
      return NextResponse.json({ error: "AVNU API key not configured" }, { status: 500 });
    }

    // Build the gasless transaction using AVNU API
    const avnuResponse = await fetch("https://sepolia.api.avnu.fi/swap/v1/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": avnuApiKey,
      },
      body: JSON.stringify({
        accountAddress: account.address,
        calls: calls,
        gasTokenAddress: options?.gasTokenAddress || "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d", // STRK
        maxFeePercentage: options?.maxFeePercentage || 0.01,
        includeReverted: false,
      }),
    });

    if (!avnuResponse.ok) {
      const errorData = await avnuResponse.text();
      console.error("AVNU API error:", errorData);
      return NextResponse.json(
        { error: "Failed to build gasless transaction" },
        { status: avnuResponse.status }
      );
    }

    const result = await avnuResponse.json();
    
    return NextResponse.json({
      transactionHash: result.transactionHash,
      calls: result.calls,
    });
  } catch (error) {
    console.error("Execute calls error:", error);
    return NextResponse.json(
      { error: "Failed to execute gasless calls" },
      { status: 500 }
    );
  }
}