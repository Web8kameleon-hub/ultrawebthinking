"use client";

import Link from "next/link";
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
        background: "rgba(10, 10, 35, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      })}
    >
      <div
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
          color: "white",
          cursor: "pointer",
        })}
      >
        Ultrawebthinking
      </div>

      <div
        className={css({
          display: "flex",
          gap: "6",
        })}
      >
        <Link href="#features" passHref>
          <a
            className={css({
              fontWeight: "medium",
              color: "white",
              textDecoration: "none",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "cyan.400" },
            })}
          >
            Veçoritë
          </a>
        </Link>
        <Link href="#explore" passHref>
          <a
            className={css({
              fontWeight: "medium",
              color: "white",
              textDecoration: "none",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "cyan.400" },
            })}
          >
            Eksploro
          </a>
        </Link>
        <Link href="#contact" passHref>
          <a
            className={css({
              fontWeight: "medium",
              color: "white",
              textDecoration: "none",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "cyan.400" },
            })}
          >
            Kontakti
          </a>
        </Link>
      </div>
    </nav>
  );
}
