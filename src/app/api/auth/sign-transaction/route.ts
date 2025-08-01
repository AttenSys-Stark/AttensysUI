import { NextRequest, NextResponse } from "next/server";
import { Account } from "starknet";
import { provider } from "@/constants";
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
    const {
      encryptedPrivateKey,
      address,
      transactionData,
      transactionType = "invoke",
    } = await request.json();

    if (!encryptedPrivateKey || !address || !transactionData) {
      return NextResponse.json(
        { error: "Missing required parameters" },
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

    // Decrypt the private key server-side
    const decryptedPrivateKey = decryptPrivateKey(
      encryptedPrivateKey,
      encryptionSecret,
    );

    if (!decryptedPrivateKey) {
      return NextResponse.json(
        { error: "Failed to decrypt private key" },
        { status: 500 },
      );
    }

    // Create account instance server-side
    const account = new Account(provider, address, decryptedPrivateKey);

    let signedTransaction;

    try {
      if (transactionType === "invoke") {
        signedTransaction = await account.execute(transactionData);
      } else if (transactionType === "declare") {
        signedTransaction = await account.declare(transactionData);
      } else if (transactionType === "deploy") {
        signedTransaction = await account.deployContract(transactionData);
      } else {
        return NextResponse.json(
          { error: "Unsupported transaction type" },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        transactionHash: signedTransaction.transaction_hash,
        transaction: signedTransaction,
      });
    } catch (transactionError) {
      console.error("Transaction signing error:", transactionError);
      return NextResponse.json(
        {
          error: "Transaction signing failed",
          details: transactionError instanceof Error ? transactionError.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Sign transaction error:", error);
    return NextResponse.json(
      { error: "Transaction signing failed" },
      { status: 500 },
    );
  }
}
