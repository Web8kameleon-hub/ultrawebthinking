import { orchestrator } from "./utils/orchestrator";

async function testAGI() {
  const input = "Cila është detyra për sot?";
  const response = await orchestrator.execute(input);
  console.log("🔁 Përgjigja e AGI:", response);
}

testAGI();
