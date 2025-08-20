import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (!body) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { cid, expires = 86400 } = parsedBody;
    
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
    console.error("Access link error:", error);
    return NextResponse.json(
      { error: "Failed to create access link" },
      { status: 500 }
    );
  }
}