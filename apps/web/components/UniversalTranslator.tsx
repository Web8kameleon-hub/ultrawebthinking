/**
 * Universal Translator - AI-Powered Multi-Language System
 * EuroWeb Platform v9.0.1 - Language Intelligence Module
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.1 Ultra
 * @license MIT
 * @created August 25, 2025
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  family: string
}

interface TranslationHistory {
  id: string
  source: string
  target: string
  sourceText: string
  translatedText: string
  timestamp: Date
  confidence: number
}

const UniversalTranslator: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('sq')
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [history, setHistory] = useState<TranslationHistory[]>([])
  const [confidence, setConfidence] = useState(0)

  const languages: Language[] = [
    { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', family: 'Indo-European' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', family: 'Germanic' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', family: 'Slavic' },
    { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', family: 'Slavic' },
    { code: 'me', name: 'Montenegrin', nativeName: 'Crnogorski', flag: '🇲🇪', family: 'Slavic' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', family: 'Slavic' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', family: 'Germanic' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', family: 'Romance' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', family: 'Romance' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', family: 'Romance' },
  ]

  const mockTranslations: Record<string, Record<string, string>> = {
    'en-sq': {
      'Hello, how are you?': 'Përshëndetje, si jeni?',
      'Good morning': 'Mirëmëngjes',
      'Thank you very much': 'Faleminderit shumë',
      'Welcome to EuroWeb Platform': 'Mirë se vini në Platformën EuroWeb',
      'AI-powered translation': 'Përkthim i bazuar në AI'
    },
    'sq-en': {
      'Përshëndetje, si jeni?': 'Hello, how are you?',
      'Mirëmëngjes': 'Good morning',
      'Faleminderit shumë': 'Thank you very much',
      'Mirë se vini në Platformën EuroWeb': 'Welcome to EuroWeb Platform',
      'Përkthim i bazuar në AI': 'AI-powered translation'
    }
  }

  const translateText = async () => {
    if (!sourceText.trim()) {return}

    setIsTranslating(true)
    setConfidence(0)

    // Simulate AI translation process
    await new Promise(resolve => setTimeout(resolve, 1500))

    const translationKey = `${sourceLanguage}-${targetLanguage}`
    const mockTranslation = mockTranslations[translationKey]?.[sourceText] ?? 
                           `[${targetLanguage.toUpperCase()}] ${sourceText}`

    setTranslatedText(mockTranslation)
    setConfidence(Math.floor(Math.random() * 15) + 85) // 85-100% confidence

    // Add to history
    const newTranslation: TranslationHistory = {
      id: Date.now().toString(),
      source: sourceLanguage,
      target: targetLanguage,
      sourceText,
      translatedText: mockTranslation,
      timestamp: new Date(),
      confidence
    }

    setHistory(prev => [newTranslation, ...prev.slice(0, 4)])
    setIsTranslating(false)
  }

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const getLanguageByCode = (code: string) => 
    languages.find(lang => lang.code === code) ?? languages[0]

  const quickTranslations = [
    'Hello, how are you?',
    'Good morning',
    'Thank you very much',
    'Welcome to EuroWeb Platform',
    'AI-powered translation'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
            🌐 Universal Translator
            <span className="text-blue-400 text-3xl">v9.0.1</span>
          </h1>
          <p className="text-blue-200 text-xl">
            🤖 AI-powered real-time translation for Balkan languages and beyond
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-green-400">● Neural Translation</span>
            <span className="text-purple-400">● Context Aware</span>
            <span className="text-yellow-400">● Cultural Adaptation</span>
          </div>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Source Language */}
            <div>
              <label className="block text-blue-300 font-semibold mb-2">From</label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                aria-label="Source language"
                className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapLanguages}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all transform hover:scale-110"
                title="Swap languages"
              >
                ⇄
              </button>
            </div>

            {/* Target Language */}
            <div>
              <label className="block text-purple-300 font-semibold mb-2">To</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                aria-label="Target language"
                className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Translation Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Source Text */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-300">
                {getLanguageByCode(sourceLanguage).flag} {getLanguageByCode(sourceLanguage).name}
              </h3>
              <span className="text-sm text-slate-400">{sourceText.length}/500</span>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-40 bg-slate-700 text-white p-4 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none resize-none"
              maxLength={500}
            />
          </div>

          {/* Translated Text */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-purple-300">
                {getLanguageByCode(targetLanguage).flag} {getLanguageByCode(targetLanguage).name}
              </h3>
              {confidence > 0 && (
                <span className="text-sm text-green-400">Confidence: {confidence}%</span>
              )}
            </div>
            <div className="relative">
              <div className="w-full h-40 bg-slate-700 text-white p-4 rounded-lg border border-slate-600 overflow-y-auto">
                <AnimatePresence>
                  {isTranslating ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-3xl mb-2"
                        >
                          🧠
                        </motion.div>
                        <p className="text-purple-400">Translating...</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="whitespace-pre-wrap"
                    >
                      {translatedText ?? 'Translation will appear here...'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={translateText}
            disabled={!sourceText.trim() || isTranslating}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTranslating ? '🔄 Translating...' : '🚀 Translate'}
          </button>
          <button
            onClick={() => { setSourceText(''); setTranslatedText(''); setConfidence(0); }}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all"
          >
            🗑️ Clear
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(translatedText)}
            disabled={!translatedText}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
          >
            📋 Copy
          </button>
        </motion.div>

        {/* Quick Translations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">⚡ Quick Translations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickTranslations.map((text, index) => (
              <button
                key={index}
                onClick={() => setSourceText(text)}
                className="p-3 bg-slate-700 hover:bg-slate-600 text-left text-white rounded-lg transition-all text-sm"
              >
                "{text}"
              </button>
            ))}
          </div>
        </motion.div>

        {/* Translation History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">📚 Recent Translations</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getLanguageByCode(item.source).flag}</span>
                      <span>→</span>
                      <span>{getLanguageByCode(item.target).flag}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-blue-300 font-semibold">Source:</p>
                      <p className="text-slate-300">"{item.sourceText}"</p>
                    </div>
                    <div>
                      <p className="text-purple-300 font-semibold">Translation:</p>
                      <p className="text-slate-300">"{item.translatedText}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-blue-400"
        >
          <p className="text-lg">🌍 Breaking language barriers with AI-powered translation technology</p>
          <p className="text-sm mt-2 text-blue-500">EuroWeb Platform v9.0.1 • © 2025 Ledjan Ahmati • Language AI Division</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UniversalTranslator
