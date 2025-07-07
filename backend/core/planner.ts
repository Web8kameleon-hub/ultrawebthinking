import type { MindOutput } from "./mind"

export type PlanStep = {
  action: string
  target: string
  parameters: Record<string, any>
  priority: number
  reasoning: string
}

export type Plan = {
  intent: string
  topic: string
  steps: PlanStep[]
  estimatedEffort: number
  confidence: number
}

export function planActions(mind: MindOutput): Plan {
  const { intent, topic, confidence, extractedEntities, priority, reasoning } = mind

  const steps: PlanStep[] = []

  switch (intent) {
    case "greeting":
      steps.push({
        action: "respond",
        target: "user",
        parameters: { message: "Përshëndetje! Si mund të ndihmoj?" },
        priority,
        reasoning: "Input ishte përshëndetje e qartë.",
      })
      break

    case "time_request":
      steps.push({
        action: "fetch_time",
        target: "system_clock",
        parameters: {},
        priority,
        reasoning: "U kërkua koha aktuale.",
      })
      break

    case "identity_check":
      steps.push({
        action: "reveal_identity",
        target: "AGI_core",
        parameters: { name: "WEB8 Core AGI", version: "1.0.0" },
        priority,
        reasoning: "U kërkua identiteti i sistemit.",
      })
      break

    case "data_query":
      steps.push({
        action: "search_data",
        target: "internet",
        parameters: { query: extractedEntities.join(" ") },
        priority,
        reasoning: `Kërkesë për të kërkuar të dhëna: ${extractedEntities.join(", ")}`,
      })
      break

    case "action_request":
      steps.push({
        action: "execute_command",
        target: "internal_module",
        parameters: { task: topic },
        priority,
        reasoning: "Kërkesë për të ekzekutuar një komandë.",
      })
      break

    case "system_status":
      steps.push({
        action: "check_status",
        target: "system_monitor",
        parameters: {},
        priority,
        reasoning: "Kërkesë për shëndetin e brendshëm të sistemit.",
      })
      break

    default:
      steps.push({
        action: "log_unclassified",
        target: "monitor",
        parameters: { originalIntent: intent, context: topic },
        priority: 10,
        reasoning: "Nuk u identifikua qëllimi me saktësi. Nevojitet eskalim.",
      })
      break
  }

  return {
    intent,
    topic,
    steps,
    estimatedEffort: steps.length * priority,
    confidence,
  }
}
