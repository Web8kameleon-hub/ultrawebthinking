import type { SearchProvider } from "./provider";
import { BraveSearch } from "./websearch";

let provider: SearchProvider;

export function getSearchProvider(): SearchProvider {
    if (!provider) {
        // Can add more adapters and read from ENV PROVIDER=brave|...
        provider = new BraveSearch();
    }
    return provider;
}
