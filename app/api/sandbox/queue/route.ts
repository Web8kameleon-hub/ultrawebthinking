import { NextResponse } from "next/server";
import { approvalQueue } from "@/backend/sandbox/approval-queue";

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true,
      items: approvalQueue.list() 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
