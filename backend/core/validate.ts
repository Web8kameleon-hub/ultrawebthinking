import { monitor } from './monitor'

export type ValidationAnalysis = {
  isValid: boolean
  reason?: string
  suggestions?: string[]
  category: ValidationCategory
  maliciousScore: number
  semanticIntent: string
}

export type ValidationCategory =
  | "ok"
  | "empty"
  | "too_long"
  | "malicious"
  | "offensive"
  | "ambiguous"
  | "system_command"
  | "unknown"

const offensiveWords = ["idiot", "budalla", "vritu", "hesht"]
const dangerousPatterns = /(\<script|\$\{|\}|\*|%|\^|\\|\/\/)/i

export class Validator {
  private maxLength = 512

  analyze(input: string): ValidationAnalysis {
    const text = input.trim()
    const result: ValidationAnalysis = {
      isValid: true,
      category: "ok",
      maliciousScore: 0,
      semanticIntent: this.categorizeIntent(text),
    }

    if (text.length === 0) {
      return {
        ...result,
        isValid: false,
        reason: "Fusha është bosh.",
        category: "empty",
        suggestions: ["Shkruaj një fjali me kuptim të plotë."],
      }
    }

    if (text.length > this.maxLength) {
      return {
        ...result,
        isValid: false,
        reason: "Teksti është shumë i gjatë.",
        category: "too_long",
        suggestions: ["Shkurto mesazhin në më pak se 500 karaktere."],
      }
    }

    if (dangerousPatterns.test(text)) {
      result.maliciousScore += 5
      result.category = "malicious"
      result.isValid = false
      result.reason = "Përmban karaktere të rrezikshme ose të ndaluara."
      result.suggestions = ["Hiq simbolet e ndaluara si <, >, {, }, $, %, etj."]
      monitor.warn(`[VALIDATOR] Pattern i rrezikshëm: ${text}`)
      return result
    }

    for (const word of offensiveWords) {
      if (text.toLowerCase().includes(word)) {
        result.maliciousScore += 3
        result.category = "offensive"
        result.isValid = false
        result.reason = `Gjuha ofenduese detektuar: "${word}"`
        result.suggestions = ["Formuloje mesazhin në mënyrë më profesionale."]
        monitor.warn(`[VALIDATOR] Fjalë ofenduese: ${word}`)
        return result
      }
    }

    // Klasifikim i komandave të brendshme
    if (text.startsWith("/") || text.startsWith("sudo")) {
      result.maliciousScore += 1
      result.category = "system_command"
      result.reason = "Urdhër i sistemit i padeklaruar."
      result.isValid = false
      result.suggestions = ["Komandat duhen dhënë përmes protokollit të lejuar."]
      return result
    }

    // Klasifikim i pasigurt
    if (result.semanticIntent === "unknown") {
      result.category = "ambiguous"
      result.reason = "Qëllimi nuk është i qartë."
      result.suggestions = ["Sqaroni më mirë pyetjen ose qëllimin."]
    }

    return result
  }

  private categorizeIntent(text: string): string {
    const lower = text.toLowerCase()
    if (lower.includes("si je") || lower.includes("gjendja")) return "check_status"
    if (lower.includes("plan") || lower.includes("ide")) return "request_plan"
    if (lower.includes("fakti") || lower.includes("trego")) return "query_info"
    if (lower.includes("reset") || lower.includes("fshi")) return "system_reset"
    if (lower.includes("etik") || lower.includes("moral")) return "ethical_check"
    return "unknown"
  }
}
