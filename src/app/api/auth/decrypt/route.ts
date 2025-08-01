import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ALGO = "aes-256-gcm";

// Server-side decryption function
function decryptPrivateKey(encrypted: string, secret: string): string {
  const [ivB64, authTagB64, encryptedB64] = encrypted.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedB64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function POST(request: NextRequest) {
  try {
    const { encryptedData } = await request.json();

    if (!encryptedData) {
      return NextResponse.json(
        { error: "Encrypted data is required" },
        { status: 400 },
      );
    }

    const encryptionSecret = process.env.ENCRYPTION_SECRET;

    if (!encryptionSecret) {
      return NextResponse.json(
        { error: "Encryption secret not configured" },
        { status: 500 },
      );
    }

    const decryptedData = decryptPrivateKey(encryptedData, encryptionSecret);

    return NextResponse.json({
      success: true,
      decryptedData,
    });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 });
  }
}
