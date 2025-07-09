import { NextRequest, NextResponse } from "next/server";

// Helper to canonicalize Starknet address to 0x + 64 hex chars
function toCanonicalAddress(address: string): string {
  if (!address) return address;
  let hex = address.startsWith("0x") ? address.slice(2) : address;
  hex = hex.padStart(64, "0");
  return "0x" + hex;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  const { notificationIds } = await req.json();

  // Canonicalize the Starknet address
  const canonicalAddress = toCanonicalAddress(address);

  // TODO: Add your database/storage logic here to mark notifications as read for canonicalAddress
  console.log("Marking notifications as read for address:", canonicalAddress);
  console.log("Notification IDs:", notificationIds);

  // For now, just return success
  return NextResponse.json({ success: true });
}
