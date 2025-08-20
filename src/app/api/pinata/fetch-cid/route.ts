import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cid = searchParams.get("cid");
    
    if (!cid) {
      return NextResponse.json({ error: "CID required" }, { status: 400 });
    }

    const gatewayUrl = process.env.GATEWAY_URL || "https://gateway.pinata.cloud";
    const pinataJwt = process.env.PINATA_JWT;
    
    const response = await fetch(`${gatewayUrl}/ipfs/${cid}`, {
      headers: pinataJwt ? {
        Authorization: `Bearer ${pinataJwt}`,
      } : {},
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from IPFS");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("IPFS fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}