import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cid, expires = 86400 } = body;
    
    if (!cid) {
      return NextResponse.json({ error: "CID required" }, { status: 400 });
    }

    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.GATEWAY_URL,
    });

    const accessUrl = await pinata.gateways.private.createAccessLink({
      cid,
      expires,
    });

    return NextResponse.json({ url: accessUrl });
  } catch (error) {
    console.error("Create access link error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}