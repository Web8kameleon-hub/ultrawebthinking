import { orchestrator } from "../orchestrator";

export async function handleRequest(input: string): Promise<string> {
  return await orchestrator.execute(input);
}