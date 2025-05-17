"use client";

import React from "react";
import { css } from "@styled-system/css";

const Hero = () => {
  return (
    <section
      className={css({
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #1a1a40, #0a0a23)",
        color: "white",
        textAlign: "center",
        overflow: "hidden",
      })}
    >
      <div
        className={css({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        })}
      ></div>
      <h1
        className={css({
          fontSize: "4xl",
          fontWeight: "bold",
          marginBottom: "4",
        })}
      >
        Mirësevini në Ultrawebthinking
      </h1>
      <p
        className={css({
          fontSize: "lg",
          marginBottom: "6",
          maxWidth: "600px",
        })}
      >
        Eksperienca juaj e nivelit të ardhshëm në web fillon këtu.
      </p>
      <button
        className={css({
          paddingX: "6",
          paddingY: "3",
          fontSize: "md",
          fontWeight: "medium",
          color: "white",
          background: "cyan.500",
          border: "none",
          borderRadius: "md",
          cursor: "pointer",
          transition: "background 0.2s ease-in-out",
          "&:hover": {
            background: "cyan.600",
          },
        })}
      >
        Fillo Tani
      </button>
    </section>
  );
};

export default Hero;

