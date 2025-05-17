import { orchestrator } from "../utils/orchestrator"; // Adjusted the path to the correct location

async function testAGI() {
  const input = "Cila është detyra për sot?";
  const response = await orchestrator.execute(input);
  console.log("🔁 Përgjigja e AGI:", response);
}

testAGI();
