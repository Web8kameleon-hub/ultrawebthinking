import Link from "next/link";
import React from "react";

const SidebarNavigation: React.FC = () => {
  const menuItems = [
    { href: "/", label: "🏠 Home", description: "Dashboard kryesor" },
    { href: "/aviation", label: "✈️ Aviation Weather", description: "METAR/TAF Data" },
    { href: "/status", label: "📊 System Status", description: "Health Monitor" },
    { href: "/test-utt", label: "🪙 UTT Demo", description: "Token Testing" },
    { href: "/openmind", label: "🧠 OpenMind AI", description: "AI Gateway" },
    { href: "/guardian", label: "🛡️ Guardian", description: "Security Control" },
    { href: "/browser", label: "🌐 Web8 Browser", description: "Advanced Browser" },
    { href: "/agi-demo", label: "🤖 AGI Demo", description: "AI Demo" }
  ];

  return (
    <aside style={{
      width: "280px",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      padding: "1rem",
      borderRight: "1px solid #e2e8f0",
      height: "100vh",
      overflowY: "auto"
    }}>
      <nav>
        <div style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          borderBottom: "2px solid #3b82f6",
          color: "#1e40af",
          fontWeight: "bold"
        }}>
          🚀 EuroWeb Navigation
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.href} style={{ marginBottom: "0.5rem" }}>
              <Link
                href={item.href}
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#374151",
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3b82f6";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                  {item.description}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNavigation;
