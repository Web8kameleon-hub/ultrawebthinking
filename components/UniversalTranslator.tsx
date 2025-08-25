/**
 * Universal Translation Component
 * Komponenti Universal i Përkthimit
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UniversalTranslationEngine, { 
  LanguageInfo, 
  TranslationRequest, 
  TranslationResult 
} from '../lib/universalTranslationEngine';

const UniversalTranslator = () => {
  const [engine] = useState(() => UniversalTranslationEngine.getInstance());
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageInfo | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [mode, setMode] = useState<'technical' | 'creative' | 'formal' | 'casual' | 'cultural'>('casual');
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageInfo[]>([]);

  useEffect(() => {
    setSupportedLanguages(engine.getSupportedLanguages());
  }, [engine]);

  // Auto-translate when input changes
  useEffect(() => {
    if (inputText.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        handleTranslate();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setTranslatedText('');
      setDetectedLanguage(null);
      setTranslationResult(null);
    }
  }, [inputText, toLanguage, mode]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const request: TranslationRequest = {
        text: inputText,
        fromLanguage: fromLanguage === 'auto' ? undefined : fromLanguage,
        toLanguage,
        mode,
        preserveFormatting: true
      };

      const result = await engine.translateText(request);
      setTranslationResult(result);
      setTranslatedText(result.translatedText);
      setDetectedLanguage(result.fromLanguage);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Error occurred during translation');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    if (fromLanguage !== 'auto' && detectedLanguage) {
      setFromLanguage(toLanguage);
      setToLanguage(detectedLanguage.code);
      setInputText(translatedText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleQuickTranslate = (text: string) => {
    setInputText(text);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🌍 Universal Translator
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            margin: 0
          }}>
            Motori Universal i Përkthimit • Kuptojmë çdo gjuhë • We understand every language
          </p>
        </div>

        {/* Language Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>From:</label>
            <select
              value={fromLanguage}
              onChange={(e) => setFromLanguage(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="auto" style={{color: 'black'}}>🔍 Auto-detect</option>
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code} style={{color: 'black'}}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={swapLanguages}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            🔄
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>To:</label>
            <select
              value={toLanguage}
              onChange={(e) => setToLanguage(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '14px'
              }}
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code} style={{color: 'black'}}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Mode */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {(['casual', 'formal', 'technical', 'creative', 'cultural'] as const).map(m => (
            <motion.button
              key={m}
              onClick={() => setMode(m)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: mode === m ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.3)',
                background: mode === m ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                textTransform: 'capitalize'
              }}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {/* Translation Interface */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Input */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {detectedLanguage ? 
                  `📝 ${detectedLanguage.nativeName} (${Math.round(detectedLanguage.confidence)}% confidence)` : 
                  '📝 Enter text'
                }
              </span>
              <motion.button
                onClick={() => copyToClipboard(inputText)}
                whileHover={{ scale: 1.1 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📋
              </motion.button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text here... / Shkruani ose ngjitni tekstin këtu..."
              style={{
                width: '100%',
                height: '120px',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '14px',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          {/* Output */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {toLanguage ? 
                  `🎯 ${supportedLanguages.find(l => l.code === toLanguage)?.nativeName}` : 
                  '🎯 Translation'
                }
              </span>
              <motion.button
                onClick={() => copyToClipboard(translatedText)}
                whileHover={{ scale: 1.1 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📋
              </motion.button>
            </div>
            <div style={{
              width: '100%',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              overflowY: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isTranslating ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '5px' }}>🔄</div>
                  <div>Translating...</div>
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  {translatedText || 'Translation will appear here...'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Translation Details */}
        {translationResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📊 Translation Details</h3>
            
            {translationResult.alternatives.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <strong>🔄 Alternatives:</strong>
                <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                  {translationResult.alternatives.map((alt, index) => (
                    <div key={index} style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      marginBottom: '3px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTranslatedText(alt)}
                    >
                      {alt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {translationResult.culturalNotes && translationResult.culturalNotes.length > 0 && (
              <div>
                <strong>🏛️ Cultural Notes:</strong>
                <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                  {translationResult.culturalNotes.map((note, index) => (
                    <li key={index} style={{ marginBottom: '3px', fontSize: '13px' }}>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Phrases */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '15px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>⚡ Quick Phrases</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {[
              'Hello / Përshëndetje',
              'Thank you / Faleminderit',
              'How are you? / Si jeni?',
              'Good morning / Mirëmëngjes',
              'Please help me / Ju lutem ndihmoni',
              'I love you / Te dua'
            ].map((phrase, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickTranslate(phrase.split(' / ')[0])}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textAlign: 'left'
                }}
              >
                {phrase}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UniversalTranslator;
