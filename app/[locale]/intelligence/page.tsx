"use client";
import { useState } from "react";
import SearchPanel from "../../../components/SearchPanel";
import SystemStats from "../../../components/SystemStats";

export default function IntelligencePage() {
    const [ingestUrl, setIngestUrl] = useState("");
    const [ingestLoading, setIngestLoading] = useState(false);
    const [ingestResult, setIngestResult] = useState<any>(null);

    const handleIngest = async () => {
        if (!ingestUrl.trim()) return;
        setIngestLoading(true);
        try {
            const res = await fetch(`/api/ingest?url=${encodeURIComponent(ingestUrl)}`);
            const data = await res.json();
            setIngestResult(data);
        } catch (error) {
            setIngestResult({ error: "Ingest failed" });
        } finally {
            setIngestLoading(false);
        }
    };

    const handleGenerateReport = () => {
        window.open("/api/report?q=artificial intelligence web8 platform", "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Web8 Intelligence Platform
                    </h1>
                    <p className="text-xl text-gray-600">
                        Real-time • Real-data • Real-docs
                    </p>
                </div>

                {/* System Stats */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Live System Telemetry</h2>
                    <SystemStats />
                </div>

                {/* Search */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Real Web Search</h2>
                    <div className="bg-white rounded-lg shadow">
                        <SearchPanel />
                    </div>
                </div>

                {/* Content Ingestion */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Content Ingestion & Analysis</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex gap-3 mb-4">
                            <input
                                type="url"
                                value={ingestUrl}
                                onChange={(e) => setIngestUrl(e.target.value)}
                                placeholder="Enter URL to analyze (e.g., https://news.ycombinator.com/)"
                                className="flex-1 border rounded px-3 py-2"
                            />
                            <button
                                onClick={handleIngest}
                                disabled={ingestLoading}
                                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            >
                                {ingestLoading ? "Analyzing..." : "Ingest & Analyze"}
                            </button>
                        </div>

                        {ingestResult && (
                            <div className="mt-4 p-4 border rounded bg-gray-50">
                                {ingestResult.error ? (
                                    <div className="text-red-600">Error: {ingestResult.error}</div>
                                ) : (
                                    <div className="space-y-2">
                                        <div><strong>ID:</strong> {ingestResult.id}</div>
                                        <div><strong>Content Length:</strong> {ingestResult.contentLength.toLocaleString()} chars</div>
                                        <div><strong>Language:</strong> {ingestResult.analysis.langGuess.toUpperCase()}</div>
                                        <div><strong>Words:</strong> {ingestResult.analysis.wordCount.toLocaleString()}</div>
                                        <div><strong>Sentiment:</strong> {ingestResult.analysis.sentiment.score} (magnitude: {ingestResult.analysis.sentiment.magnitude})</div>
                                        <div><strong>Top Keywords:</strong> {ingestResult.analysis.topKeywords.slice(0, 5).map((k: any) => k.token).join(", ")}</div>
                                        <div><strong>Summary:</strong></div>
                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                            {ingestResult.analysis.summary.map((s: string, i: number) => (
                                                <li key={i}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* PDF Report Generation */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Intelligence Reports</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 mb-4">
                            Generate comprehensive PDF reports combining search results and analysis.
                        </p>
                        <button
                            onClick={handleGenerateReport}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                        >
                            📄 Generate Sample Intelligence Report
                        </button>
                    </div>
                </div>

                {/* API Endpoints */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                        GET /api/search?q=web8
                                    </div>
                                    <div className="text-sm text-gray-600">Real web search via provider</div>
                                </div>

                                <div>
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                        POST /api/analyze
                                    </div>
                                    <div className="text-sm text-gray-600">Text analysis & extraction</div>
                                </div>

                                <div>
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                        GET /api/stats
                                    </div>
                                    <div className="text-sm text-gray-600">Real-time system metrics (SSE)</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                        GET /api/report?q=query
                                    </div>
                                    <div className="text-sm text-gray-600">PDF intelligence report</div>
                                </div>

                                <div>
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                        GET /api/ingest?url=...
                                    </div>
                                    <div className="text-sm text-gray-600">Content ingestion & analysis</div>
                                </div>

                                <div>
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                        GET /api/ingested
                                    </div>
                                    <div className="text-sm text-gray-600">View ingested content summary</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
