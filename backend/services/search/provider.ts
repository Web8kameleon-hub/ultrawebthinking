export type SearchResult = {
    id: string;
    title: string;
    url: string;
    snippet: string;
    source: string;
    ts: number;
};

export interface SearchProvider {
    name(): string;
    search(q: string, opts?: { count?: number; lang?: string }): Promise<SearchResult[]>;
}
