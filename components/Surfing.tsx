import React, { useState } from "react";
import { agi } from "@/agi/core";
import { motion } from "framer-motion";
import "./SurfingAI.css";

const SurfingAI: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /**
   * Funksioni për të lexuar përgjigjen me zë duke përdorur SpeechSynthesis.
   * @param text - Teksti që duhet lexuar.
   */
  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "sq-AL"; // Gjuha e leximit (mund ta ndryshoni në "en-US", "de-DE", etj.)
      speechSynthesis.speak(utterance);
    } else {
      console.warn("SpeechSynthesis nuk mbështetet në këtë shfletues.");
    }
  };

  const handleAsk = async () => {
    if (!input.trim()) {
      setError("Ju lutemi shkruani një pyetje.");
      return;
    }
    setError("");
    setLoading(true);
    setResponse("AGI po mendon...");

    try {
      const reply = await agi.run(input);
      setResponse(reply);
      speakResponse(reply); // Lexo përgjigjen me zë
    } catch (err) {
      console.error("Gabim në AGI:", err);
      setResponse("Ndodhi një gabim gjatë përpunimit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="surfing-ai-section">
      <motion.div
        className="surfing-ai-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Ndërvepro me AGI</h2>
        <input
          type="text"
          placeholder="Shkruaj një pyetje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="surfing-input"
        />
        {error && <p className="surfing-error">{error}</p>}
        <button
          onClick={handleAsk}
          disabled={loading}
          className="surfing-button"
        >
          {loading ? "Duke menduar..." : "Pyet AGI-n"}
        </button>
        {response && (
          <motion.div
            className="surfing-response"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {response}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default SurfingAI;
```
.surfing-ai-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  color: white;
  padding: 20px;
}

.surfing-ai-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.surfing-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

.surfing-button {
  background: #ffd700;
  color: #000;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.surfing-button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.surfing-button:hover:not(:disabled) {
  background: #ffc107;
}

.surfing-response {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  font-size: 16px;
}

.surfing-error {
  color: #ff4d4d;
  font-size: 14px;
  margin-bottom: 10px;
}
