// 🧠 Bazë për të gjithë memory.json
export type MemoryData = {
  context: {
    [timestamp: string]: MemoryEntry
  }
  timestamp: string
}

// 🔄 Një hyrje në memorien AGI (input + përgjigje + intent + rezultat)
export type MemoryEntry = {
  input: string
  output: string
  intent: string
  layer: AGILayer
  status: "success" | "error" | "filtered"
}

// 🧬 Tip për kërkesat që vijnë në sistem
export type InputPayload = {
  message: string
  userId?: string
  language?: string
  meta?: Record<string, any>
}

// 🛡 Kategoritë e validimit
export type ValidationCategory =
  | "ok"
  | "empty"
  | "too_long"
  | "malicious"
  | "offensive"
  | "ambiguous"
  | "system_command"
  | "unknown"

// 🧪 Rezultati i analizës së validimit
export type ValidationAnalysis = {
  isValid: boolean
  reason?: string
  suggestions?: string[]
  category: ValidationCategory
  maliciousScore: number
  semanticIntent: string
}

// 🧠 Shtresa inteligjente (për kontroll qendror ushtarak)
export type AGILayer =
  | "LAYER_ZERO"       // memorje e brendshme pa ndërhyrje
  | "LAYER_ONE"        // sensing
  | "LAYER_TWO"        // planifikim
  | "LAYER_THREE"      // logjikë reagimi
  | "LAYER_FOUR"       // analizë qëllimi
  | "LAYER_FIVE"       // siguri & etikë
  | "LAYER_SIX"        // vendimmarrje autonome
  | "LAYER_SEVEN"      // ndërveprim me përdoruesin
  | "LAYER_EIGHT"      // kontroll multi-agent
  | "LAYER_NINE"       // vetërinovim
  | "LAYER_TEN"        // trajnim i thellë
  | "LAYER_ELEVEN"     // mision kritik
  | "LAYER_TWELVE"     // ndërveprim global/mesh

