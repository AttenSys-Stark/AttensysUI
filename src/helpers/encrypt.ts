import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended for GCM

// Encrypts a string using AES-256-GCM
export function encryptPrivateKey(plainText: string, secret: any): string {
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

// Decrypts a string using AES-256-GCM
export function decryptPrivateKey(encrypted: string, secret: any): string {
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
