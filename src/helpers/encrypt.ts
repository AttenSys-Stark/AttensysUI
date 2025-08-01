import crypto from "crypto";
import { EncryptionService } from "@/lib/encryptionService";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended for GCM

// DEPRECATED: Use EncryptionService.encryptPrivateKey() instead
// This function is kept for backward compatibility but should not be used
export function encryptPrivateKey(plainText: string, secret: any): string {
  console.warn(
    "DEPRECATED: encryptPrivateKey() is deprecated. Use EncryptionService.encryptPrivateKey() instead.",
  );

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.createHash("sha256").update(secret).digest();
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  // Store iv + authTag + encrypted, all base64-encoded
  return [iv.toString("base64"), authTag.toString("base64"), encrypted].join(
    ":",
  );
}

// DEPRECATED: Use EncryptionService.decryptPrivateKey() instead
// This function is kept for backward compatibility but should not be used
export function decryptPrivateKey(encrypted: string, secret: any): string {
  console.warn(
    "DEPRECATED: decryptPrivateKey() is deprecated. Use EncryptionService.decryptPrivateKey() instead.",
  );

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

// New async functions that use server-side APIs
export async function encryptPrivateKeyAsync(
  plainText: string,
): Promise<string> {
  return await EncryptionService.encryptPrivateKey(plainText);
}

export async function decryptPrivateKeyAsync(
  encryptedData: string,
): Promise<string> {
  return await EncryptionService.decryptPrivateKey(encryptedData);
}
