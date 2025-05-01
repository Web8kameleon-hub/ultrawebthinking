// components/Footer.tsx
// components/Footer.tsx
import { css } from "@styled-system/css";
import { Github, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className={css({
        paddingY: "8",
        paddingX: "6",
        background: "rgba(10, 10, 35, 0.6)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4",
        color: "white",
        textAlign: "center",
        fontSize: "sm",
        mt: "12",
      }) + ""}
    >
      <div className={css({ fontWeight: "semibold", fontSize: "md" })}>
        Ultrawebthinking © 2025 – Beyond Imagination
      </div>

      <div className={css({ display: "flex", gap: "4" })}>
        <a
          href="https://github.com/Web8kameleon-hub"
          target="_blank"
          rel="noopener noreferrer"
          className={css({ _hover: { color: "blue.400" } }) + ""}
        >
          <Github size={20} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className={css({ _hover: { color: "blue.400" } }) + ""}
        >
          <Linkedin size={20} />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className={css({ _hover: { color: "blue.400" } }) + ""}
        >
          <Youtube size={20} />
        </a>
      </div>

      <div className={css({ color: "gray.400" })}>
        Version 1.0 – Krijuar me pasion & logjikë të pastër
      </div>
    </footer>
  );
}

