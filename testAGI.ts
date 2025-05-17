import { orchestrator } from "./src/orchestrator";

/**
 * Runs a test for the AGI orchestrator with enhanced functionality.
 */
async function testAGI(): Promise<void> {
  try {
    console.log("🚀 Starting AGI test...");

    // Define multiple inputs for testing
    const inputs = [
      "Cila është detyra për sot?",
      "Cila është gjendja aktuale?",
      "Çfarë sugjeron për përmirësime?"
    ];

    // Execute each input and log the response
    for (const input of inputs) {
      console.log(`📥 Input: ${input}`);
      const response = await orchestrator.execute(input);
      console.log(`🧠 AGI Response: ${response}`);
    }

    console.log("✅ AGI test completed successfully.");
  } catch (error: unknown) {
    console.error("❌ Error during AGI test execution:", error);
  }
}

// Run the test
testAGI();
