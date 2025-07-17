"use client";

import React from "react";
import { motion } from "framer-motion";
import { css } from "../styled-system/css";

const Surfing: React.FC = () => {
  // Static values instead of state
  const input = "";
  const response = "";
  const loading = false;
  const error = "";

  const handleAsk = () => {
    console.log('Surfing functionality disabled');
  };

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
        color: "white",
        padding: "8",
      })}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={css({
          bg: "rgba(255, 255, 255, 0.08)",
          p: "6",
          borderRadius: "xl",
          boxShadow: "lg",
          textAlign: "center",
          maxW: "lg",
          w: "full",
        })}
      >
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
          Interact with AGI
        </h2>

        <input
          type="text"
          placeholder="Surfing functionality disabled..."
          value={input}
          readOnly
          disabled
          aria-label="Ask a question (disabled)"
          className={css({
            w: "full",
            p: "3",
            mb: "3",
            borderRadius: "md",
            fontSize: "md",
            color: "black",
          })}
        />

        {error && <p className={css({ color: "red.400", mb: "2" })}>{error}</p>}

        <button
          type="button"
          onClick={handleAsk}
          disabled
          className={css({
            bg: "gray.400",
            color: "black",
            px: "5",
            py: "2",
            borderRadius: "md",
            cursor: "not-allowed",
            fontWeight: "bold",
          })}
          aria-busy={loading}
        >
          Ask AGI (Disabled)
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={css({
            mt: "6",
            p: "4",
            bg: "rgba(255,255,255,0.05)",
            borderRadius: "md",
            fontSize: "md",
            color: "white",
            wordBreak: "break-word",
          })}
        >
          Surfing functionality has been disabled to remove useState dependencies
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Surfing;
