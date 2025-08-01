import { NextRequest, NextResponse } from "next/server";

// Helper to canonicalize Starknet address to 0x + 64 hex chars
function toCanonicalAddress(address: string): string {
  if (!address) return address;
  let hex = address.startsWith("0x") ? address.slice(2) : address;
  hex = hex.padStart(64, "0");
  return "0x" + hex;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  // Canonicalize the Starknet address
  const canonicalAddress = toCanonicalAddress(address);

  // TODO: Add your database/storage logic here to get unread notifications for canonicalAddress
  console.log("Getting unread notifications for address:", canonicalAddress);

  // For now, return empty array (no unread notifications)
  return NextResponse.json([]);
}
