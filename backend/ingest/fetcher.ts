// Using built-in fetch (Node.js 18+)
export async function fetchText(url: string): Promise<string> {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "Web8Bot/1.0 (EuroWeb Intelligence Platform)",
            "Accept": "text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8"
        }
    });

    if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const json = await res.json();
        return JSON.stringify(json, null, 2);
    }

    return res.text();
}
