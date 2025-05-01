// components/Navbar.tsx
import '@fontsource/poppins';

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "linear-gradient(90deg, #0a0a23, #1a1a3c)",
        boxShadow: "0 4px 12px rgba(255, 215, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 215, 0, 0.15)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <img src="/logo.png" alt="Ultrawebthinking Logo" style={{ height: "40px" }} />
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#FFD700",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Ultrawebthinking
        </span>
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["Features", "Explore", "Contact"].map((text, i) => (
          <a
            key={i}
            href={`#${text.toLowerCase()}`}
            style={{
              fontWeight: "500",
              color: "#FFCC00",
              fontFamily: "'Poppins', sans-serif",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#FFCC00")}
          >
            {text}
          </a>
        ))}
      </div>
    </nav>
  );
}

