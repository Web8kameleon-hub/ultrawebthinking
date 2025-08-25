import { NextResponse } from "next/server";

export async function GET() {
  console.log("🧠 Metrics API called!");
  
  try {
    // Simple test without system calls first
    const testData = {
      cpu: 25.5,
      gpu: 15.2,
      memory: {
        used: 8.2,
        total: 16.0,
        percentage: 51.25
      },
      loadAverage: [1.2, 1.1, 1.0],
      uptime: 12345,
      timestamp: new Date().toISOString(),
      status: "test-mode"
    };

    console.log("📊 Returning test data:", testData);
    
    return NextResponse.json(testData);
    
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get metrics" },
      { status: 500 }
    );
  }
}
