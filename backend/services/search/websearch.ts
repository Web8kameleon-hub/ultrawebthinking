import { randomUUID } from "crypto";
import { request } from "undici";
import { SearchProvider, SearchResult } from "./provider";

const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

export class BraveSearch implements SearchProvider {
    name() { return "brave"; }

    async search(q: string, opts?: { count?: number; lang?: string }): Promise<SearchResult[]> {
        const count = Math.min(Math.max(opts?.count ?? 8, 1), 20);
        const headers: Record<string, string> = {
            "Accept": "application/json",
            "X-Subscription-Token": process.env.BRAVE_API_KEY || ""
        };

        const url = `${BRAVE_ENDPOINT}?q=${encodeURIComponent(q)}&count=${count}${opts?.lang ? `&country=${opts.lang}` : ""}`;

        const res = await request(url, { method: "GET", headers });
        if (res.statusCode >= 400) throw new Error(`Search failed: ${res.statusCode}`);

        const data = await res.body.json() as any;
        const items = (data.web?.results ?? []) as any[];

        return items.map((it: any): SearchResult => ({
            id: randomUUID(),
            title: it.title ?? "",
            url: it.url ?? it.link ?? "",
            snippet: it.description ?? it.snippet ?? "",
            source: "brave",
            ts: Date.now()
        }));
    }
}
