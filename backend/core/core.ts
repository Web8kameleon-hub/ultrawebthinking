import { loadMemory, saveMemory } from './memory'
import { monitor } from './monitor'
import { Validator } from './validate'
import { ResponseEngine } from './response'
import { Planner } from './planner'
import { SenseUnit } from './sense'
import { InputPayload, MemoryEntry } from './types'

export class AGICore {
  private memory = loadMemory()
  private validator = new Validator()
  private responder = new ResponseEngine()
  private planner = new Planner()
  private sensor = new SenseUnit()

  constructor() {
    monitor.log("Layer0", "🔁 AGICore u inicializua.")
  }

  async run(input: InputPayload): Promise<string> {
    try {
      const cleanInput = this.sensor.clean(input.message)
      const meta = this.sensor.analyze(cleanInput)

      const validation = this.validator.analyze(cleanInput)
      if (!validation.isValid) {
        return `⚠️ ${validation.reason}\nSugjerime: ${validation.suggestions?.join(" | ")}`
      }

      const plan = this.planner.generatePlan(meta.intent, meta.keywords)
      const response = this.responder.generate({
        input: cleanInput,
        memory: this.memory,
        userId: input.userId,
      })

      this.updateMemory(cleanInput, response, meta.intent)
      return response
    } catch (err: any) {
      monitor.error("Layer0", `❌ AGICore.run() error: ${err.message}`, err)
      return "🚫 Ndodhi një gabim gjatë përpunimit të input-it."
    }
  }

  private updateMemory(input: string, output: string, intent: string) {
    const timestamp = Date.now().toString()
    const entry: MemoryEntry = {
      input,
      output,
      intent,
      layer: "LAYER_ZERO", // ose përdor një variabël dinamike
      status: "success",
    }

    this.memory.context = this.memory.context || {}
    this.memory.context[timestamp] = entry
    this.memory.timestamp = new Date().toISOString()

    try {
      saveMemory(this.memory)
      monitor.log("Layer0", "💾 Memoria u ruajt me sukses.")
    } catch (err: any) {
      monitor.warn("[CORE]", `❗ Problem gjatë ruajtjes së memories: ${err?.message}`)
    }
  }
}
