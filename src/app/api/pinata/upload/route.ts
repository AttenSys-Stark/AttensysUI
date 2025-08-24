import { NextResponse } from "next/server";
import { PinataSDK } from "pinata";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create new FormData for Pinata upload
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    // Mark as private network
    pinataFormData.append("network", "private");

    // Optional metadata
    const metadata = {
      name: file.name,
      keyvalues: {
        isPrivate: "true",
      },
    };
    pinataFormData.append("pinataMetadata", JSON.stringify(metadata));

    const response = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const result = await response.json();
    
    // Extract CID from Pinata v3 API response
    const cid = result?.data?.cid || result?.cid || result;

    return NextResponse.json({
      data: {
        cid: cid,
      },
      private: true,
    });
  } catch (error) {
    console.error("Pinata error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
