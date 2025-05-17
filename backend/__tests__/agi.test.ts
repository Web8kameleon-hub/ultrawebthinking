import { AGICore } from "../ai/agi/core";

describe("AGICore Module", () => {
  let agiCore: AGICore;

  beforeEach(() => {
    agiCore = new AGICore();
  });

  it("should initialize correctly", () => {
    expect(agiCore).toBeDefined();
  });

  it("should process input and return expected output", async () => {
    const input = "Test input";
    const output = await agiCore.run(input);
    expect(output).toContain("Processed"); // Kontrolloni për një rezultat të pritur
  });
});
```
ultrawebthinking/
├── backend/
│   ├── ai/
│   │   ├── agi/
│   │   │   ├── core.ts
│   │   │   └── ...
│   ├── __tests__/
│   │   ├── agi.test.ts
│   │   ├── example.test.ts
│   │   └── agicore.test.ts
├── jest.config.ts
├── package.json