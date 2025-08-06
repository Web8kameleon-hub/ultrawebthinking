/**
 * WEB8 Search Server - Clean Implementation
 */

/**
 * WEB8 Search Server - Clean Implementation
 */

import express, { Request, Response } from "express";
import cors from "cors";
import { MultiSearchEngine } from "./MultiSearchEngine";

const app = express();
const search = new MultiSearchEngine();

app.use(express.json());
app.use(cors());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: Date.now() });
});

app.get('/api/search', async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q) return res.status(400).json({ error: 'Missing query' });
  
  try {
    const result = await search.search(q, { maxResults: 50 });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export class SearchAPIServer {
  start() {
    app.listen(3001, () => console.log('🚀 API ready on :3001'));
  }
}

export const searchAPIServer = new SearchAPIServer();
