"use client";
import { useState } from "react";

export default function AnalysisPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const analyzeText = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: "Analysis failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        📝 Text Analysis Engine
                    </h1>
                    <p className="text-xl text-gray-600">
                        Real NLP • Language Detection • Sentiment Analysis
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Input Text</h2>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text to analyze... (supports Albanian, German, English)"
                            className="w-full h-64 p-4 border rounded-lg resize-none"
                        />
                        <button
                            onClick={analyzeText}
                            disabled={loading || !text.trim()}
                            className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "🧠 Analyze Text"}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
                        {result ? (
                            result.error ? (
                                <div className="text-red-600">Error: {result.error}</div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-3 rounded">
                                            <div className="font-semibold text-blue-700">Language</div>
                                            <div className="text-2xl">{result.langGuess?.toUpperCase()}</div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded">
                                            <div className="font-semibold text-green-700">Words</div>
                                            <div className="text-2xl">{result.wordCount?.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded">
                                        <h3 className="font-semibold text-yellow-700 mb-2">Sentiment</h3>
                                        <div className="flex items-center gap-4">
                                            <span>Score: {result.sentiment?.score}</span>
                                            <span>Magnitude: {result.sentiment?.magnitude}</span>
                                            <span className={`px-2 py-1 rounded text-sm ${result.sentiment?.score > 0 ? 'bg-green-200 text-green-800' :
                                                    result.sentiment?.score < 0 ? 'bg-red-200 text-red-800' :
                                                        'bg-gray-200 text-gray-800'
                                                }`}>
                                                {result.sentiment?.score > 0 ? 'Positive' :
                                                    result.sentiment?.score < 0 ? 'Negative' : 'Neutral'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded">
                                        <h3 className="font-semibold text-purple-700 mb-2">Top Keywords</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.topKeywords?.slice(0, 10).map((keyword: any, index: number) => (
                                                <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                                                    {keyword.token} ({keyword.score})
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded">
                                        <h3 className="font-semibold text-gray-700 mb-2">Extractive Summary</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {result.summary?.map((sentence: string, index: number) => (
                                                <li key={index}>{sentence}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="text-gray-500 text-center py-8">
                                Enter text and click "Analyze Text" to see results
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">🔧 API Information</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">Endpoint</h4>
                            <div className="font-mono bg-gray-100 p-2 rounded">
                                POST /api/analyze
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Features</h4>
                            <ul className="space-y-1 text-gray-700">
                                <li>✅ Language detection (DE/SQ/EN)</li>
                                <li>✅ Keyword extraction (TF-based)</li>
                                <li>✅ Sentiment analysis</li>
                                <li>✅ Extractive summarization</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
