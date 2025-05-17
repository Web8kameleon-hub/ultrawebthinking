import { AGICore } from "../ai/agi/core";
import { connectToMongo, disconnectFromMongo } from "../db/mongAdapter";

(async () => {
  try {
    console.log("🔗 Connecting to the database...");
    await connectToMongo();
    console.log("✅ Successfully connected to the database.");

    const agi = new AGICore();

    const input: string = "Cili është plani për sot?";
    console.log(`📥 Input: ${input}`);

    const response: string = await agi.run(input);
    console.log(`💬 AGI Response: ${response}`);
  } catch (error: unknown) {
    console.error("❌ Error during application execution:", error);
  } finally {
    console.log("🔒 Closing the application...");
    try {
      await disconnectFromMongo();
      console.log("✅ Successfully disconnected from the database.");
    } catch (disconnectError) {
      console.error("❌ Error while disconnecting from the database:", disconnectError);
    }
  }
})();