import { AGICore } from "../src/ai/agi/core";

describe("AGICore", () => {
  it("duhet të kthejë një përgjigje të vlefshme", async () => {
    const core = new AGICore();
    const response = await core.run("Test input");
    expect(response).toBeDefined();
  });
});