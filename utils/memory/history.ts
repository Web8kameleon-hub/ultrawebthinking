import { Low, JSONFile } from "lowdb";

const adapter = new JSONFile("memory.json");
const db = new Low(adapter);

export class MemoryHistory {
  async save(state: any): Promise<void> {
    await db.read();
    db.data ||= { history: [] };
    db.data.history.push(state);
    await db.write();
  }

  async getHistory(): Promise<any[]> {
    await db.read();
    return db.data?.history || [];
  }
}

export const memoryHistory = new MemoryHistory();