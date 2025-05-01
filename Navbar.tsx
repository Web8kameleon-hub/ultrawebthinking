// components/Navbar.tsx
import { css } from "@styled-system/css";

export default function Navbar() {
  return (
    <nav
      className={css({
        position: "sticky",
        top: 0,
        zIndex: 999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: "6",
        paddingY: "4",
        background: "rgba(10, 10, 35, 0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }).toString()}
    >
      <div className={css({ fontSize: "2xl", fontWeight: "bold" })}>
        Ultrawebthinking
      </div>
      <div className={css({ display: "flex", gap: "6" })}>
        <a href="#features" className={css({ fontWeight: "medium" })}>
          Veçoritë
        </a>
        <a href="#explore" className={css({ fontWeight: "medium" })}>
          Eksploro
        </a>
        <a href="#contact" className={css({ fontWeight: "medium" })}>
          Kontakti
        </a>
      </div>
    </nav>
  );
}
