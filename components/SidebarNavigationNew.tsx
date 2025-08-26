import Link from "next/link";
import React from "react";

const SidebarNavigation: React.FC = () => {
    const menuItems = [
        // Core Dashboard
        { href: "/", label: "🏠 Home", description: "Dashboard kryesor", category: "core" },

        // Intelligence Platform
        { href: "/intelligence", label: "🧠 Intelligence Platform", description: "Real-data Analytics", category: "intelligence" },
        { href: "/search", label: "🔍 Web Search", description: "Real-time Search", category: "intelligence" },
        { href: "/analysis", label: "📝 Text Analysis", description: "NLP & Sentiment", category: "intelligence" },
        { href: "/reports", label: "📄 PDF Reports", description: "Dynamic Reports", category: "intelligence" },
        { href: "/ingestion", label: "🌐 Content Ingestion", description: "URL Analysis", category: "intelligence" },

        // System Monitoring
        { href: "/status", label: "📊 System Status", description: "Health Monitor", category: "system" },
        { href: "/stats", label: "⚡ Live Statistics", description: "Real-time Metrics", category: "system" },
        { href: "/aviation", label: "✈️ Aviation Weather", description: "METAR/TAF Data", category: "system" },

        // AGI & AI Systems
        { href: "/agi-demo", label: "🤖 AGI Dashboard", description: "AI Control Center", category: "ai" },
        { href: "/openmind", label: "🧠 OpenMind AI", description: "AI Gateway", category: "ai" },
        { href: "/guardian", label: "🛡️ Guardian", description: "Security Control", category: "ai" },

        // Blockchain & Networks
        { href: "/test-utt", label: "🪙 UTT Token", description: "Blockchain Testing", category: "blockchain" },
        { href: "/lora", label: "📡 LoRa Network", description: "Mesh Network", category: "blockchain" },
        { href: "/mesh", label: "🕸️ Network Mesh", description: "P2P Network", category: "blockchain" },

        // Tools & Utilities
        { href: "/browser", label: "🌐 Web8 Browser", description: "Advanced Browser", category: "tools" },
        { href: "/api-docs", label: "📚 API Documentation", description: "API Reference", category: "tools" },
        { href: "/postman", label: "🧪 API Testing", description: "Postman Collection", category: "tools" }
    ];

    const categories = {
        core: { name: "🏠 Core", color: "#3b82f6" },
        intelligence: { name: "🧠 Intelligence", color: "#8b5cf6" },
        system: { name: "⚙️ System", color: "#10b981" },
        ai: { name: "🤖 AI/AGI", color: "#f59e0b" },
        blockchain: { name: "⛓️ Blockchain", color: "#ef4444" },
        tools: { name: "🛠️ Tools", color: "#6b7280" }
    };

    const groupedItems = Object.entries(categories).map(([key, category]) => ({
        category: key,
        ...category,
        items: menuItems.filter(item => item.category === key)
    }));

    return (
        <aside style={{
            width: "340px",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            padding: "1rem",
            borderRight: "1px solid #e2e8f0",
            height: "100vh",
            overflowY: "auto"
        }}>
            <nav>
                <div style={{
                    marginBottom: "1.5rem",
                    padding: "0.75rem",
                    borderBottom: "2px solid #3b82f6",
                    color: "#1e40af",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    textAlign: "center"
                }}>
                    🚀 Web8 UltraThinking Platform
                </div>

                {groupedItems.map((group) => (
                    <div key={group.category} style={{ marginBottom: "1.5rem" }}>
                        <div style={{
                            padding: "0.5rem 0.75rem",
                            marginBottom: "0.5rem",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: group.color,
                            borderLeft: `3px solid ${group.color}`,
                            paddingLeft: "0.75rem",
                            background: "rgba(255, 255, 255, 0.5)",
                            borderRadius: "4px"
                        }}>
                            {group.name}
                        </div>

                        <ul style={{ listStyle: "none", padding: 0, margin: 0, paddingLeft: "0.5rem" }}>
                            {group.items.map((item) => (
                                <li key={item.href} style={{ marginBottom: "0.25rem" }}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: "block",
                                            padding: "0.6rem 0.75rem",
                                            borderRadius: "6px",
                                            textDecoration: "none",
                                            color: "#374151",
                                            background: "rgba(255, 255, 255, 0.7)",
                                            border: "1px solid #e5e7eb",
                                            transition: "all 0.2s ease",
                                            fontSize: "0.875rem"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = group.color;
                                            e.currentTarget.style.color = "#ffffff";
                                            e.currentTarget.style.transform = "translateX(4px)";
                                            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
                                            e.currentTarget.style.color = "#374151";
                                            e.currentTarget.style.transform = "translateX(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <div style={{ fontWeight: "500", marginBottom: "0.1rem" }}>
                                            {item.label}
                                        </div>
                                        <div style={{
                                            fontSize: "0.75rem",
                                            opacity: 0.8
                                        }}>
                                            {item.description}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div style={{
                    marginTop: "2rem",
                    padding: "0.75rem",
                    borderTop: "1px solid #e5e7eb",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    textAlign: "center"
                }}>
                    Web8 Intelligence Platform v8.0.0<br />
                    Real-time • Real-data • Real-docs
                </div>
            </nav>
        </aside>
    );
};

export default SidebarNavigation;
