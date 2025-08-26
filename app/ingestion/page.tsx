"use client";
import { useState } from "react";

export default function IngestionPage() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [ingested, setIngested] = useState<any>(null);

    const ingestContent = async () => {
        if (!url.trim()) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/ingest?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            setResult(data);

            // Refresh ingested data summary
            const summaryResponse = await fetch('/api/ingested');
            const summaryData = await summaryResponse.json();
            setIngested(summaryData);
        } catch (error) {
            setResult({ error: "Ingestion failed" });
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const response = await fetch('/api/ingested');
            const data = await response.json();
            setIngested(data);
        } catch (error) {
            setIngested({ error: "Failed to load summary" });
        }
    };

    const sampleUrls = [
        "https://example.com",
        "https://news.ycombinator.com",
        "https://github.com/trending",
        "https://stackoverflow.com/questions/tagged/javascript",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🌐 Content Ingestion Engine
                    </h1>
                    <p className="text-xl text-gray-600">
                        Fetch, analyze, and store web content automatically
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Ingestion Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Ingest New Content</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL to Analyze
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full p-3 border rounded-lg"
                                />
                            </div>

                            <button
                                onClick={ingestContent}
                                disabled={loading || !url.trim()}
                                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
                            >
                                {loading ? "Ingesting..." : "🌐 Ingest & Analyze"}
                            </button>

                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Sample URLs:</h3>
                                <div className="space-y-1">
                                    {sampleUrls.map((sample, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setUrl(sample)}
                                            className="block w-full text-left px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                                        >
                                            {sample}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {result && (
                            <div className="mt-6 p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Ingestion Result</h3>
                                {result.error ? (
                                    <div className="text-red-600">Error: {result.error}</div>
                                ) : (
                                    <div className="space-y-2 text-sm">
                                        <div><strong>ID:</strong> {result.id}</div>
                                        <div><strong>Content Length:</strong> {result.contentLength?.toLocaleString()} chars</div>
                                        <div><strong>Language:</strong> {result.analysis?.langGuess?.toUpperCase()}</div>
                                        <div><strong>Words:</strong> {result.analysis?.wordCount?.toLocaleString()}</div>
                                        <div><strong>Sentiment:</strong> {result.analysis?.sentiment?.score} (magnitude: {result.analysis?.sentiment?.magnitude})</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Ingested Data Summary</h2>
                            <button
                                onClick={loadSummary}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {ingested ? (
                            ingested.error ? (
                                <div className="text-red-600">Error: {ingested.error}</div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-3 rounded">
                                            <div className="font-semibold text-blue-700">Total Items</div>
                                            <div className="text-2xl">{ingested.total}</div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded">
                                            <div className="font-semibold text-green-700">Avg Words</div>
                                            <div className="text-2xl">{ingested.avgWordCount}</div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded">
                                        <h3 className="font-semibold text-purple-700 mb-2">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(ingested.byLanguage || {}).map(([lang, count]: [string, any]) => (
                                                <span key={lang} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                                                    {lang.toUpperCase()}: {count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded">
                                        <h3 className="font-semibold text-gray-700 mb-2">Recent Items</h3>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {ingested.recent?.map((item: any, index: number) => (
                                                <div key={index} className="text-sm border-l-2 border-gray-300 pl-3">
                                                    <div className="font-medium">{new URL(item.url).hostname}</div>
                                                    <div className="text-gray-600">
                                                        {item.lang?.toUpperCase()} • {item.words} words •
                                                        Sentiment: {item.sentiment || 0} •
                                                        {new Date(item.ts).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Click "Refresh" to load ingested data summary
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">🔧 How It Works</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl mb-2">🌐</div>
                            <div className="font-semibold">1. Fetch</div>
                            <div className="text-sm text-gray-600">Download content from URL</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🧹</div>
                            <div className="font-semibold">2. Clean</div>
                            <div className="text-sm text-gray-600">Extract text from HTML</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🧠</div>
                            <div className="font-semibold">3. Analyze</div>
                            <div className="text-sm text-gray-600">NLP analysis and insights</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">💾</div>
                            <div className="font-semibold">4. Store</div>
                            <div className="text-sm text-gray-600">Save results for later use</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">📡 API Endpoints</h3>
                        <div className="space-y-2 text-sm">
                            <div className="font-mono bg-gray-100 p-2 rounded">
                                GET /api/ingest?url=https://example.com
                            </div>
                            <div className="font-mono bg-gray-100 p-2 rounded">
                                GET /api/ingested
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">✨ Features</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li>✅ Real HTTP content fetching</li>
                            <li>✅ HTML parsing and text extraction</li>
                            <li>✅ Automatic language detection</li>
                            <li>✅ Keyword and sentiment analysis</li>
                            <li>✅ In-memory storage (upgradeable to DB)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
