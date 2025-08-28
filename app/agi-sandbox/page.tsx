"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ReviewItem = {
  id: string; 
  ts: string; 
  reason: string; 
  status: "PENDING"|"APPROVED"|"DENIED";
  req: { 
    kind: string; 
    meta: { agentId: string; ts: string }; 
    params: Record<string, any> 
  };
};

type SandboxStatus = {
  agentId: string;
  scope: string;
  status: string;
  auditValid: boolean;
  totalAuditEntries: number;
  capabilities: string[];
  emergencyMode: boolean;
};

type BudgetInfo = {
  junior: { allocated: number; used: number; remaining: number };
  albion: { allocated: number; used: number; remaining: number };
};

/**
 * AGI Sandbox Control Panel
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-SANDBOX
 */
export default function AGISandboxPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [status, setStatus] = useState<SandboxStatus | null>(null);
  const [budget, setBudget] = useState<BudgetInfo | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Load approval queue
      const queueRes = await fetch("/api/sandbox/queue");
      const queueData = await queueRes.json();
      if (queueData.success) setItems(queueData.items || []);

      // Load sandbox status
      const statusRes = await fetch("/api/sandbox");
      const statusData = await statusRes.json();
      if (statusData.success) setStatus(statusData.sandbox);

      // Load budget info
      const budgetRes = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "budget" })
      });
      const budgetData = await budgetRes.json();
      if (budgetData.success) setBudget(budgetData.budget);

    } catch (error) {
      console.error("Failed to load sandbox data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    const interval = setInterval(loadData, 3000); 
    return () => clearInterval(interval); 
  }, []);

  const handleAction = async (id: string, action: "approve" | "deny") => {
    setBusy(id);
    try {
      const res = await fetch(`/api/sandbox/queue/${id}/${action}`, { 
        method: "POST" 
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(`Error: ${error.error || res.status}`);
      } else {
        await loadData();
      }
    } catch (error) {
      alert(`Network error: ${error}`);
    } finally {
      setBusy(null);
    }
  };

  const testAGI = async (capability: "junior" | "albion") => {
    setBusy("test");
    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          kind: "TOKEN_TRANSFER",
          params: { amountALB: 5, to: "TEST-ADDRESS" },
          capability,
          dryRun: false,
          humanGate: true
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Test successful! Result: ${JSON.stringify(data.result, null, 2)}`);
        await loadData();
      } else {
        alert(`Test failed: ${data.error}`);
      }
    } catch (error) {
      alert(`Test error: ${error}`);
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800">Loading AGI Sandbox...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🤖 AGI Freedom Sandbox
              </h1>
              <p className="text-gray-600 mt-2">
                Control panel for Web8 AGI with human approval gates
              </p>
            </div>
            <div className="text-right">
              {status && (
                <div className="space-y-1">
                  <div className={`text-sm font-medium ${status.emergencyMode ? 'text-red-600' : 'text-green-600'}`}>
                    {status.emergencyMode ? '🚨 Emergency Mode' : '✅ Active'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Audit: {status.auditValid ? '✅ Valid' : '❌ Invalid'} ({status.totalAuditEntries} entries)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Budget Card */}
          {budget && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Budget Status</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Junior ({budget.junior.used}/{budget.junior.allocated} ALB)</span>
                    <span className="text-green-600">{budget.junior.remaining} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(budget.junior.used / budget.junior.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Albion ({budget.albion.used}/{budget.albion.allocated} ALB)</span>
                    <span className="text-blue-600">{budget.albion.remaining} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(budget.albion.used / budget.albion.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Test Actions Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">🧪 Test AGI</h3>
            <div className="space-y-3">
              <button
                onClick={() => testAGI("junior")}
                disabled={busy === "test"}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {busy === "test" ? "Testing..." : "Test Junior Lane"}
              </button>
              <button
                onClick={() => testAGI("albion")}
                disabled={busy === "test"}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {busy === "test" ? "Testing..." : "Test Albion Lane"}
              </button>
            </div>
          </motion.div>

          {/* Queue Stats Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Queue Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-bold text-orange-600">
                  {items.filter(i => i.status === "PENDING").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Approved:</span>
                <span className="font-bold text-green-600">
                  {items.filter(i => i.status === "APPROVED").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Denied:</span>
                <span className="font-bold text-red-600">
                  {items.filter(i => i.status === "DENIED").length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Approval Queue */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              🛡️ Human Approval Queue
            </h2>
            <p className="text-gray-600 mt-1">
              Review and approve/deny AGI requests
            </p>
          </div>

          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🤖</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-500">AGI is operating within approved parameters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-800">
                          {item.req.kind}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "PENDING" ? "bg-orange-100 text-orange-800" :
                          item.status === "APPROVED" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(item.ts).toLocaleString()}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
{JSON.stringify({ params: item.req.params, meta: item.req.meta }, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {item.status === "PENDING" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAction(item.id, "approve")}
                          disabled={busy === item.id}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {busy === item.id ? "Processing..." : "✅ Approve"}
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "deny")}
                          disabled={busy === item.id}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {busy === item.id ? "Processing..." : "❌ Deny"}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}