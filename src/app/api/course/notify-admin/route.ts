import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { courseName, creatorName, message } = await request.json();
    
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    // Here you would integrate with your email service
    // For now, just log and return success
    console.log("Admin notification:", {
      to: adminEmail,
      subject: `New Course: ${courseName}`,
      creator: creatorName,
      message,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin notified successfully" 
    });
  } catch (error) {
    console.error("Admin notification error:", error);
    return NextResponse.json(
      { error: "Failed to notify admin" },
      { status: 500 }
    );
  }
}