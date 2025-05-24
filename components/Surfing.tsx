"use client";

import React, { useState } from "react";
import { agi } from "../backend/ai/agi/core"; // përdor rrugë relative nëse aliasi nuk punon
import { motion } from "framer-motion";
import { css } from "@styled-system/css";

const Surfing: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleAsk = async () => {
    if (!input.trim()) {
      setError("Please enter a question.");
      return;
    }
    setError("");
    setLoading(true);
    setResponse("");

    try {
      const reply = await agi.run(input);
      setResponse(reply);
      setInput(""); // opsionale: pastron input-in pas përgjigjes
    } catch (err) {
      setResponse("");
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
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
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleAsk(); }}
          aria-label="Ask a question"
          className={css({
            w: "full",
            p: "3",
            mb: "3",
            borderRadius: "md",
            fontSize: "md",
            color: "black",
          })}
          disabled={loading}
        />

        {error && <p className={css({ color: "red.400", mb: "2" })}>{error}</p>}

        <button
          type="button"
          onClick={handleAsk}
          disabled={loading}
          className={css({
            bg: loading ? "gray.400" : "yellow.400",
            color: "black",
            px: "5",
            py: "2",
            borderRadius: "md",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            _hover: { bg: loading ? "gray.400" : "yellow.300" },
          })}
          aria-busy={loading}
        >
          {loading ? "Thinking..." : "Ask AGI"}
        </button>

        {response && (
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
            {response}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Surfing;
