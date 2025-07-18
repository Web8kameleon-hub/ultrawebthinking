// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer
      className={{
        padding: "32px 24px",
        background: "rgba(248, 250, 252, 0.9)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(99, 102, 241, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        color: "#64748b",
        textAlign: "center",
        fontSize: "14px",
        marginTop: "48px",
      }}
    >
      <div className={{ fontWeight: "500", fontSize: "16px" }}>
        Ultrawebthinking © 2025 – Beyond Imagination
      </div>

      <div className={{ display: "flex", gap: "16px" }}>
        <a
          href="https://github.com/Web8kameleon-hub"
          target="_blank"
          rel="noopener noreferrer"
          className={{
            color: "#4682b4",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className={{
            color: "#4682b4",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
        >
          LinkedIn
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className={{
            color: "#4682b4",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
        >
          YouTube
        </a>
      </div>

      <div className={{ color: "#6b7280", fontSize: "12px" }}>
        Version 1.0 – Krijuar me pasion & logjikë të pastër
      </div>
    </footer>
  );
}

