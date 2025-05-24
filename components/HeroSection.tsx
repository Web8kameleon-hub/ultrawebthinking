import React from "react";

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #0a0a23, #1a1a3c)",
  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
  color: "#FFD700",
  textAlign: "center",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
};

const animatedDivStyle: React.CSSProperties = {
  position: "absolute",
  top: "-50%",
  left: "-50%",
  width: "200%",
  height: "200%",
  background: "radial-gradient(circle, rgba(255, 215, 0, 0.2), transparent)",
  animation: "rotate 10s linear infinite",
  zIndex: 0,
};

const h1Style: React.CSSProperties = {
  fontSize: "3.5rem",
  fontWeight: "bold",
  fontFamily: "'Poppins', sans-serif",
  textShadow: "0 0 15px rgba(255, 215, 0, 0.8)",
  marginBottom: "1rem",
  zIndex: 1,
};

const pStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  color: "#FFCC00",
  marginBottom: "2rem",
  zIndex: 1,
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(90deg, #FFD700, #FFCC00)",
  color: "#0a0a23",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
  zIndex: 1,
};

export default function HeroSection(): JSX.Element {
  // Ruaj stilin fillestar për hover efektin
  const [btnStyle, setBtnStyle] = React.useState<React.CSSProperties>(buttonStyle);

  return (
    <section style={sectionStyle}>
      {/* Efektet e animuara */}
      <div style={animatedDivStyle}></div>

      <h1 style={h1Style}>Ultrawebthinking</h1>
      <p style={pStyle}>
        Eksploroni të ardhmen e teknologjisë me një prekje diamanti.
      </p>
      <button
        style={btnStyle}
        onMouseEnter={() =>
          setBtnStyle({
            ...buttonStyle,
            background: "#FFCC00",
            color: "#FFFFFF",
          })
        }
        onMouseLeave={() => setBtnStyle(buttonStyle)}
      >
        Mëso më shumë
      </button>
    </section>
  );
}