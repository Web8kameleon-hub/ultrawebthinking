import React, { useEffect, useState } from "react";

interface HealthMetrics {
  totalLogs: number;
  errors: number;
  infos: number;
  lastUpdated: string;
}

export const HealthReport: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    totalLogs: 0,
    errors: 0,
    infos: 0,
    lastUpdated: "",
  });

  useEffect(() => {
    const updateMetrics = () => {
      const logs = []; // Replace with actual log retrieval if available
      const errors = logs.filter((log) => log.level === "error").length;
      const infos = logs.filter((log) => log.level === "info").length;

      setMetrics({
        totalLogs: logs.length,
        errors,
        infos,
        lastUpdated: new Date().toLocaleString(),
      });
    };

    updateMetrics();

    // Opsionale: Përditësoni automatikisht çdo 10 sekonda
    const interval = setInterval(updateMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (): string => {
    if (metrics.errors === 0) return "🟢 Stabil";
    if (metrics.errors < 10) return "🟡 Nën kontroll";
    return "🔴 Jo stabil";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 AGI Health Report</h2>
      <p>Status: <strong>{getStatus()}</strong></p>
      <p>✅ Informacione: {metrics.infos}</p>
      <p>❌ Gabime: {metrics.errors}</p>
      <p>📦 Totali i logjeve: {metrics.totalLogs}</p>
      <p>🕒 Përditësuar: {metrics.lastUpdated}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem",
    border: "2px solid #ccc",
    borderRadius: "1rem",
    backgroundColor: "#f9f9f9",
    maxWidth: "400px",
    margin: "1rem auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
};