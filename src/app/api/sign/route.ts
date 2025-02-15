import { type NextRequest, NextResponse } from "next/server";
import { pinata } from "../../../../utils/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const url = "";
    return NextResponse.json(url, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { text: "Error creating API Key:" },
      { status: 500 },
    );
  }
}
