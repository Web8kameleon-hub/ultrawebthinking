import type { SenseData } from "./sense"

export type MindIntent =
  | "greeting"
  | "data_query"
  | "action_request"
  | "system_status"
  | "identity_check"
  | "time_request"
  | "unknown"

export interface MindOutput {
  intent: MindIntent
  topic: string
  confidence: number
  extractedEntities: string[]
  priority: number
  reasoning: string
}

export function processMind(sense: SenseData): MindOutput {
  const { cleanInput, isQuestion, keywords, sentimentScore } = sense

  let intent: MindIntent = "unknown"
  let topic = "undefined"
  let priority = 1
  let reasoning = "Nuk u identifikua një qëllim i qartë."
  const extractedEntities: string[] = []

  const kwSet = new Set(keywords)

  if (["hello", "hi", "hey", "greetings"].some(k => kwSet.has(k))) {
    intent = "greeting"
    topic = "welcome"
    priority = 1
    reasoning = "Input përmban përshëndetje direkte."
  } else if (isQuestion && kwSet.has("time")) {
    intent = "time_request"
    topic = "current_time"
    priority = 2
    reasoning = "Pyetje për kohën u zbuluan në fjalët kyçe."
  } else if (isQuestion && kwSet.has("who")) {
    intent = "identity_check"
    topic = "identity"
    priority = 3
    reasoning = "Kërkesë për vetëidentifikim e zbuluar nga fjala 'who'."
  } else if (kwSet.has("search") || kwSet.has("find")) {
    intent = "data_query"
    topic = "search_request"
    priority = 4
    reasoning = "Fjalë kyçe sugjerojnë kërkesë për të gjetur informacion."
  } else if (["run", "build", "execute", "start"].some(k => kwSet.has(k))) {
    intent = "action_request"
    topic = "task_execution"
    priority = 5
    reasoning = "U detektua një komandë për ekzekutim veprimi."
  } else if (kwSet.has("status") || kwSet.has("health")) {
    intent = "system_status"
    topic = "internal_status"
    priority = 6
    reasoning = "Kërkesë për statusin e sistemit."
  }

  return {
    intent,
    topic,
    confidence: Math.min(1, 0.7 + sentimentScore / 10),
    extractedEntities: keywords.filter(k => k.length > 3),
    priority,
    reasoning,
  }
}
