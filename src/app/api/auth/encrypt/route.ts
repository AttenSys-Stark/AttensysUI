import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;

// Server-side encryption function
function encryptPrivateKey(plainText: string, secret: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.createHash("sha256").update(secret).digest();
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  return [iv.toString("base64"), authTag.toString("base64"), encrypted].join(":");
}

export async function POST(request: NextRequest) {
  try {
    const { plainText } = await request.json();
    
    if (!plainText) {
      return NextResponse.json(
        { error: "Plain text is required" },
        { status: 400 }
      );
    }

    const encryptionSecret = process.env.ENCRYPTION_SECRET;
    
    if (!encryptionSecret) {
      return NextResponse.json(
        { error: "Encryption secret not configured" },
        { status: 500 }
      );
    }

    const encryptedData = encryptPrivateKey(plainText, encryptionSecret);
    
    return NextResponse.json({
      success: true,
      encryptedData
    });
    
  } catch (error) {
    console.error("Encryption error:", error);
    return NextResponse.json(
      { error: "Encryption failed" },
      { status: 500 }
    );
  }
} 