import { MemoryData } from './types'
import { monitor } from './monitor'

type ResponseOptions = {
  input: string
  memory: MemoryData
  userId?: string
}

export class ResponseEngine {
  private contextWindow = 5  // Sa mesazhe të fundit të analizohen

  generate({ input, memory, userId }: ResponseOptions): string {
    const history = this.getRecentContext(memory)

    const intent = this.detectIntent(input)
    const tone = this.detectTone(input)
    const style = this.selectStyle(intent, tone)

    const response = this.formulateResponse(input, intent, style, history)

    monitor.log(`[ResponseEngine] intent: ${intent}, tone: ${tone}, style: ${style}`)
    return response
  }

  private getRecentContext(memory: MemoryData): string[] {
    const entries = Object.values(memory.context)
    const last = entries.slice(-this.contextWindow)
    return last.map(e => `${e.input} -> ${e.output}`)
  }

  private detectIntent(input: string): string {
    const text = input.toLowerCase()
    if (text.includes("si je") || text.includes("gjendja")) return "check_status"
    if (text.includes("informacion") || text.includes("trego")) return "query_info"
    if (text.includes("ide") || text.includes("plan")) return "request_idea"
    if (text.includes("përshëndetje") || text.includes("hello")) return "greeting"
    return "unknown"
  }

  private detectTone(input: string): "friendly" | "neutral" | "aggressive" {
    if (/faleminderit|ju lutem|të lutem/i.test(input)) return "friendly"
    if (/budalla|idiot|ik|hesht/i.test(input)) return "aggressive"
    return "neutral"
  }

  private selectStyle(intent: string, tone: string): "formal" | "casual" | "strict" {
    if (tone === "aggressive") return "strict"
    if (intent === "greeting") return "casual"
    if (intent === "query_info") return "formal"
    return "casual"
  }

  private formulateResponse(
    input: string,
    intent: string,
    style: string,
    history: string[]
  ): string {
    switch (intent) {
      case "greeting":
        return style === "casual"
          ? "Hey! Jam gati për çdo pyetje që ke."
          : "Përshëndetje, jam në shërbimin tuaj."

      case "check_status":
        return "Gjithçka operon në kushte optimale. Sistemi është stabil."

      case "query_info":
        return "Të lutem specifiko çfarë informacioni kërkon – jam i përgatitur për të ndihmuar."

      case "request_idea":
        return "Bazuar në historikun tënd, mund të sugjeroj një qasje kreative."

      default:
        return `Input-i nuk u klasifikua saktë. Mund të riformulosh pyetjen?`
    }
  }
}
