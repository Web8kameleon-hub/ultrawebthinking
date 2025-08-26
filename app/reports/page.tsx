"use client";
import { useState } from "react";

export default function ReportsPage() {
    const [query, setQuery] = useState("artificial intelligence web8");
    const [loading, setLoading] = useState(false);

    const generateReport = () => {
        if (!query.trim()) return;
        setLoading(true);

        // Open PDF in new window
        const url = `/api/report?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');

        setTimeout(() => setLoading(false), 2000);
    };

    const sampleQueries = [
        "artificial intelligence trends 2025",
        "web8 intelligence platform",
        "blockchain technology applications",
        "machine learning algorithms",
        "cybersecurity best practices"
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        📄 Dynamic PDF Reports
                    </h1>
                    <p className="text-xl text-gray-600">
                        Generate intelligence reports from real search data
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Generate Report</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Report Topic/Query
                            </label>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter topic for intelligence report..."
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>

                        <button
                            onClick={generateReport}
                            disabled={loading || !query.trim()}
                            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold"
                        >
                            {loading ? "Generating..." : "📄 Generate PDF Report"}
                        </button>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Queries:</h3>
                        <div className="flex flex-wrap gap-2">
                            {sampleQueries.map((sample, index) => (
                                <button
                                    key={index}
                                    onClick={() => setQuery(sample)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                                >
                                    {sample}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">📋 Report Contents</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✅ Query and timestamp information</li>
                            <li>✅ Real search results from web</li>
                            <li>✅ Automatic text analysis</li>
                            <li>✅ Language detection and keywords</li>
                            <li>✅ Extractive summary</li>
                            <li>✅ Sentiment analysis</li>
                            <li>✅ Professional PDF formatting</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">🔧 Technical Details</h3>
                        <div className="text-sm text-gray-700 space-y-2">
                            <div><strong>API Endpoint:</strong></div>
                            <div className="font-mono bg-gray-100 p-2 rounded">
                                GET /api/report?q=your-query
                            </div>
                            <div><strong>Process:</strong></div>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li>Performs real web search</li>
                                <li>Analyzes combined content</li>
                                <li>Generates professional PDF</li>
                                <li>Returns downloadable file</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">🎯 Use Cases</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl mb-2">🔍</div>
                            <div className="font-semibold">Market Research</div>
                            <div className="text-sm text-gray-600">Generate reports on industry trends and competitors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">📊</div>
                            <div className="font-semibold">Intelligence Briefings</div>
                            <div className="text-sm text-gray-600">Create comprehensive topic summaries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">📈</div>
                            <div className="font-semibold">Analysis Reports</div>
                            <div className="text-sm text-gray-600">Automated analysis of web content</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
