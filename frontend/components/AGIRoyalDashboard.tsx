"use client";
import React from "react";
import { useAGIRealTime } from "../hooks/useAGIRealTime";

export default function AGIRoyalDashboard() {
  const {
    activities,
    analytics,
    ethics,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    refreshData,
    getSystemHealth
  } = useAGIRealTime();

  const systemHealth = getSystemHealth();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8, background: "linear-gradient(45deg, #fff, #e0e7ff)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            🏰 AGI Royal Dashboard
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9 }}>
            Real-Time AGI System Monitoring & Control Center
          </p>
        </div>

        {/* Connection Controls */}
        <div style={{ marginBottom: 24, padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
          <h3 style={{ marginBottom: 12, fontSize: 18 }}>Real-Time Data Connection</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button 
              onClick={connect}
              style={{ 
                padding: "8px 16px", 
                background: isConnected ? "#10b981" : "#3b82f6", 
                color: "white", 
                border: "none", 
                borderRadius: 8, 
                cursor: "pointer",
                fontSize: 14
              }}
            >
              🔌 {isConnected ? "Connected" : "Connect to AGI"}
            </button>
            <button 
              onClick={disconnect}
              style={{ 
                padding: "8px 16px", 
                background: "#ef4444", 
                color: "white", 
                border: "none", 
                borderRadius: 8, 
                cursor: "pointer",
                fontSize: 14
              }}
            >
              🔌 Disconnect
            </button>
            <button 
              onClick={refreshData}
              disabled={isLoading}
              style={{ 
                padding: "8px 16px", 
                background: isLoading ? "#6b7280" : "#8b5cf6", 
                color: "white", 
                border: "none", 
                borderRadius: 8, 
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: 14
              }}
            >
              {isLoading ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {/* Status Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
          {/* Connection Status */}
          <div style={{ padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
            <h4 style={{ marginBottom: 8, fontSize: 16 }}>Connection</h4>
            <p style={{ fontSize: 14, margin: 0 }}>
              {isConnected ? "✅ Connected" : "❌ Disconnected"}
            </p>
          </div>

          {/* Loading Status */}
          <div style={{ padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
            <h4 style={{ marginBottom: 8, fontSize: 16 }}>Loading</h4>
            <p style={{ fontSize: 14, margin: 0 }}>
              {isLoading ? "⏳ Loading..." : "✅ Ready"}
            </p>
          </div>

          {/* Error Status */}
          <div style={{ padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
            <h4 style={{ marginBottom: 8, fontSize: 16 }}>Error</h4>
            <p style={{ fontSize: 14, margin: 0 }}>
              {error ? `❌ ${error}` : "✅ No errors"}
            </p>
          </div>

          {/* System Health */}
          <div style={{ padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
            <h4 style={{ marginBottom: 8, fontSize: 16 }}>System Health</h4>
            <p style={{ fontSize: 14, margin: 0 }}>
              {systemHealth}% {systemHealth > 90 ? "🟢" : systemHealth > 70 ? "🟡" : "🔴"}
            </p>
          </div>
        </div>

        {/* Activities */}
        <div style={{ marginBottom: 24, padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
          <h3 style={{ marginBottom: 12, fontSize: 18 }}>Activities</h3>
          <p style={{ fontSize: 14 }}>
            {activities.length > 0 ? `✅ ${activities.length} modules active` : "❌ 0 modules"}
          </p>
          {activities.map((activity, index) => (
            <div key={index} style={{ marginTop: 8, padding: 8, background: "rgba(255,255,255,0.05)", borderRadius: 6 }}>
              <strong>{activity.moduleName}</strong> - {activity.status} ({activity.activity}% activity)
            </div>
          ))}
        </div>

        {/* Analytics */}
        <div style={{ marginBottom: 24, padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
          <h3 style={{ marginBottom: 12, fontSize: 18 }}>Analytics</h3>
          {analytics ? (
            <div>
              <p style={{ fontSize: 14, margin: "4px 0" }}>✅ Available</p>
              <p style={{ fontSize: 12, margin: "4px 0" }}>System Load: {analytics.globalMetrics.systemLoad}%</p>
              <p style={{ fontSize: 12, margin: "4px 0" }}>Network Health: {analytics.globalMetrics.networkHealth}%</p>
              <p style={{ fontSize: 12, margin: "4px 0" }}>Security Level: {analytics.globalMetrics.securityLevel}%</p>
            </div>
          ) : (
            <p style={{ fontSize: 14, margin: 0 }}>❌ Not available</p>
          )}
        </div>

        {/* Ethics */}
        <div style={{ padding: 16, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
          <h3 style={{ marginBottom: 12, fontSize: 18 }}>Ethics</h3>
          {ethics ? (
            <div>
              <p style={{ fontSize: 14, margin: "4px 0" }}>✅ Available</p>
              <p style={{ fontSize: 12, margin: "4px 0" }}>Status: {ethics.ethicalCompliance.status}</p>
              <p style={{ fontSize: 12, margin: "4px 0" }}>Safe Think: {ethics.ethicalCompliance.safeThinkActive ? "Active" : "Inactive"}</p>
            </div>
          ) : (
            <p style={{ fontSize: 14, margin: 0 }}>❌ Not available</p>
          )}
        </div>
      </div>
    </div>
  );
}
