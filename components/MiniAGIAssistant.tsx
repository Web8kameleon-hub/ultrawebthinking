import React, { useState } from 'react';
import styles from '../styles/MiniAGIAssistant.module.css';

const MiniAGIAssistant: React.FC = () => {
  const [input, setInput] = useState<string>(''); // Për të ruajtur inputin e përdoruesit
  const [response, setResponse] = useState<string>(''); // Për të ruajtur përgjigjen e AGI-së
  const [loading, setLoading] = useState<boolean>(false); // Për të treguar statusin e ngarkimit

  /**
   * Funksioni për të dërguar inputin dhe për të marrë përgjigjen nga AGI.
   */
  const handleSend = async () => {
    if (!input.trim()) return; // Mos dërgo input bosh
    setLoading(true);

    try {
      // Simuloni një kërkesë API për të marrë përgjigjen nga AGI
      const res = await fetch('/api/agi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setResponse(data.response || 'Nuk ka përgjigje nga AGI.');
    } catch (error) {
      setResponse('Gabim gjatë komunikimit me AGI.');
    } finally {
      setLoading(false);
      setInput(''); // Pastroni fushën e inputit
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mini AGI Assistant</h2>
      <div className={styles.chatBox}>
        <textarea
          className={styles.input}
          placeholder="Shkruani pyetjen tuaj këtu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? 'Duke përpunuar...' : 'Dërgo'}
        </button>
      </div>
      {response && (
        <div className={styles.response}>
          <strong>Përgjigja e AGI-së:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default MiniAGIAssistant;

