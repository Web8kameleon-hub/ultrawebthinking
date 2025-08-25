/**
 * 🌍 Universal Translator Component - React Integration
 * Enhanced Translation Interface for EuroWeb Platform
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-REACT
 * @contact dealsjona@gmail.com
 */

import React, { useState, useEffect } from 'react'
import { useTranslator, type TranslationEntry, type LanguageSupport } from '../lib/universal-translator-core'

interface TranslatorUIProps {
  defaultSourceLang?: string
  defaultTargetLang?: string
  showLanguageFlags?: boolean
  compact?: boolean
  className?: string
}

export const TranslatorUI: React.FC<TranslatorUIProps> = ({
  defaultSourceLang = 'auto',
  defaultTargetLang = 'en',
  showLanguageFlags = true,
  compact = false,
  className = ''
}) => {
  const { translate, detectLanguage, getSupportedLanguages } = useTranslator()
  
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState(defaultSourceLang)
  const [targetLang, setTargetLang] = useState(defaultTargetLang)
  const [isTranslating, setIsTranslating] = useState(false)
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageSupport[]>([])
  const [currentTranslation, setCurrentTranslation] = useState<TranslationEntry | null>(null)

  useEffect(() => {
    setSupportedLanguages(getSupportedLanguages())
  }, [getSupportedLanguages])

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    try {
      const detectedLang = sourceLang === 'auto' ? detectLanguage(sourceText) : sourceLang
      const result = await translate(sourceText, targetLang, detectedLang)
      
      if (result) {
        setTranslatedText(result.target)
        setCurrentTranslation(result)
      } else {
        setTranslatedText('Translation not available')
        setCurrentTranslation(null)
      }
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedText('Translation failed')
      setCurrentTranslation(null)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto') {
      setSourceLang(targetLang)
      setTargetLang(sourceLang)
      setSourceText(translatedText)
      setTranslatedText(sourceText)
    }
  }

  const renderLanguageSelect = (value: string, onChange: (value: string) => void, includeAuto = false) => (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {includeAuto && <option value="auto">🔍 Auto Detect</option>}
      {supportedLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {showLanguageFlags ? `${lang.flag} ${lang.name}` : lang.name}
        </option>
      ))}
    </select>
  )

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <input
          type="text"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Type to translate..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
        />
        {renderLanguageSelect(targetLang, setTargetLang)}
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTranslating ? '...' : '🌍'}
        </button>
        {translatedText && (
          <div className="text-sm text-gray-600 italic">
            {translatedText}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">🌍 Universal Translator</h3>
        {currentTranslation && (
          <div className="text-xs text-gray-500">
            via {currentTranslation.provider} • {Math.round(currentTranslation.confidence)}% confidence
          </div>
        )}
      </div>

      {/* Language Selection */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">From</label>
          {renderLanguageSelect(sourceLang, setSourceLang, true)}
        </div>
        
        <button
          onClick={handleSwapLanguages}
          disabled={sourceLang === 'auto'}
          className="mx-4 p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Swap languages"
        >
          ⇄
        </button>
        
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">To</label>
          {renderLanguageSelect(targetLang, setTargetLang)}
        </div>
      </div>

      {/* Translation Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Source Text</label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Translated Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Translation</label>
          <div className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto">
            {isTranslating ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                Translating...
              </div>
            ) : translatedText ? (
              <div className="text-gray-800">{translatedText}</div>
            ) : (
              <div className="text-gray-400 italic">Translation will appear here...</div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* Quick Phrases */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Quick Phrases</div>
        <div className="flex flex-wrap gap-2">
          {['Hello', 'Thank you', 'Help', 'Good morning', 'How are you?'].map((phrase) => (
            <button
              key={phrase}
              onClick={() => {
                setSourceText(phrase)
                if (phrase !== sourceText) {
                  setTimeout(handleTranslate, 100)
                }
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Inline translation hook for use in other components
export const useInlineTranslator = (text: string, targetLang: string) => {
  const { translate } = useTranslator()
  const [translatedText, setTranslatedText] = useState(text)
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    if (text && targetLang !== 'en') {
      setIsTranslating(true)
      translate(text, targetLang).then((result) => {
        if (result) {
          setTranslatedText(result.target)
        }
        setIsTranslating(false)
      })
    } else {
      setTranslatedText(text)
    }
  }, [text, targetLang, translate])

  return {
    translatedText,
    isTranslating,
    originalText: text
  }
}

export default TranslatorUI
