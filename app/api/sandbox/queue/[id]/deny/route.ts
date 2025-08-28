import { NextResponse } from "next/server";
import { approvalQueue } from "@/backend/sandbox/approval-queue";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const item = approvalQueue.deny(params.id);
    if (!item) {
      return NextResponse.json({ 
        success: false, 
        error: "Request not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      denied: true,
      reason: "Denied by human operator",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
