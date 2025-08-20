import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { courseData } = await request.json();
    
    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      throw new Error("Pinata JWT not configured");
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: JSON.stringify({
        pinataContent: courseData,
        pinataMetadata: {
          name: `Course_${courseData.courseName}_${Date.now()}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload to Pinata");
    }

    const data = await response.json();
    return NextResponse.json({ ipfsHash: data.IpfsHash });
  } catch (error) {
    console.error("Pinata upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload course data" },
      { status: 500 }
    );
  }
}