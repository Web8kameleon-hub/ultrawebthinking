import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(__dirname, '..', 'logs')
const LOG_FILE = path.join(LOG_DIR, 'agi.log')

export type Severity = "INFO" | "WARN" | "ERROR" | "CRITICAL"
export type Layer =
  | "L0_MEMORY"
  | "L1_SENSE"
  | "L2_PLAN"
  | "L3_RESPONSE"
  | "L4_VALIDATE"
  | "L5_SECURITY"
  | "L6_CONTROL"
  | "L7_USER"
  | "L8_MESH"
  | "L9_SELF"
  | "L10_TRAIN"
  | "L11_MISSION"
  | "L12_GLOBAL"

interface LogEntry {
  timestamp: string
  layer: Layer
  severity: Severity
  message: string
  actor?: string
  context?: Record<string, any>
}

function now(): string {
  return new Date().toISOString()
}

function ensureLogFile() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, "")
}

function format(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.severity}] [${entry.layer}] ${entry.message}`
  const extra =
    entry.actor || entry.context
      ? ` ${entry.actor ? `actor=${entry.actor}` : ""} ${entry.context ? JSON.stringify(entry.context) : ""}`
      : ""
  return base + extra
}

function write(entry: LogEntry) {
  ensureLogFile()
  const line = format(entry) + "\n"
  fs.appendFileSync(LOG_FILE, line)

  switch (entry.severity) {
    case "CRITICAL":
    case "ERROR":
      console.error(line)
      break
    case "WARN":
      console.warn(line)
      break
    default:
      console.log(line)
  }
}

export const monitor = {
  log(layer: Layer, message: string, context?: Record<string, any>, actor?: string) {
    write({ timestamp: now(), layer, severity: "INFO", message, context, actor })
  },

  warn(layer: Layer, message: string, context?: Record<string, any>, actor?: string) {
    write({ timestamp: now(), layer, severity: "WARN", message, context, actor })
  },

  error(layer: Layer, message: string, context?: Record<string, any>, actor?: string) {
    write({ timestamp: now(), layer, severity: "ERROR", message, context, actor })
  },

  critical(layer: Layer, message: string, context?: Record<string, any>, actor?: string) {
    write({ timestamp: now(), layer, severity: "CRITICAL", message, context, actor })
    // 🚨 Trigger emergjencë në të ardhmen
  },

  audit(actor: string, event: string, layer: Layer = "L6_CONTROL") {
    const message = `AUDIT: ${actor} performed "${event}"`
    write({ timestamp: now(), layer, severity: "INFO", message, actor })
  }
}
