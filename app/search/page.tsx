"use client";
import SearchPanel from "../../components/SearchPanel";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Web8 Real-time Search
          </h1>
          <p className="text-xl text-gray-600">
            Powered by real search engines - No mock data
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <SearchPanel />
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">🌐 Search Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Real-time web search via Brave API</li>
              <li>✅ No mock or template data</li>
              <li>✅ Multiple language support</li>
              <li>✅ Configurable result count</li>
              <li>✅ Professional result formatting</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">🔧 API Usage</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="font-mono bg-gray-100 p-2 rounded">
                GET /api/search?q=query&count=10
              </div>
              <div>Returns real search results in JSON format</div>
              <div>Requires BRAVE_API_KEY environment variable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
