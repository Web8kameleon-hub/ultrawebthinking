import { NextResponse } from "next/server";
import { approvalQueue } from "@/backend/sandbox/approval-queue";
import { ActionBroker } from "@/backend/sandbox/action-broker";
import { providers, secret } from "@/backend/sandbox/wire";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const item = approvalQueue.approve(params.id);
    if (!item) {
      return NextResponse.json({ 
        success: false, 
        error: "Request not found" 
      }, { status: 404 });
    }

    // Execute the action with dryRun=false (live execution)
    const broker = new ActionBroker(secret, providers);
    const req = { 
      ...item.req, 
      meta: { ...item.req.meta, dryRun: false, humanGate: true } 
    };
    
    const result = await broker.handle(req);
    
    return NextResponse.json({ 
      success: true, 
      approved: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
