import franc from "franc"
import { SentimentAnalyzer, PorterStemmer } from "natural"
import keywordExtractor from "keyword-extractor"

export type SenseData = {
  language: string
  keywords: string[]
  sentimentScore: number
  isQuestion: boolean
  cleanInput: string
  wordCount: number
  inputLength: number
  confidenceSignal: number
}

const sentiment = new SentimentAnalyzer("English", PorterStemmer, "afinn")

export function analyzeInput(input: string): SenseData {
  const cleanInput = input.trim().toLowerCase().replace(/[^\w\s]/gi, "")
  const tokens = cleanInput.split(/\s+/).filter(Boolean)
  const wordCount = tokens.length
  const inputLength = cleanInput.length

  const language = franc(cleanInput, { minLength: 3 }) || "und"

  const keywords = keywordExtractor.extract(cleanInput, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })

  const sentimentScore = sentiment.getSentiment(tokens)
  const isQuestion = /^(who|what|why|how|when|where|is|are|can|do|does|will|should)\b/i.test(cleanInput)

  const confidenceSignal =
    (wordCount > 3 ? 0.3 : 0) +
    (sentimentScore !== 0 ? 0.2 : 0) +
    (isQuestion ? 0.2 : 0) +
    (language !== "und" ? 0.3 : 0)

  return {
    language,
    keywords,
    sentimentScore,
    isQuestion,
    cleanInput,
    wordCount,
    inputLength,
    confidenceSignal: Number(confidenceSignal.toFixed(2)),
  }
}
