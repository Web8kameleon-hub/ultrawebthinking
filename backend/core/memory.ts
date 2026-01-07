import fs from 'fs'
import path from 'path'

const MEMORY_PATH = path.join(__dirname, '..', 'memory.json')

type MemoryData = {
  context: Record<string, any>
  timestamp: string
}

export function loadMemory(): MemoryData {
  try {
    if (!fs.existsSync(MEMORY_PATH)) {
      const defaultData: MemoryData = {
        context: {},
        timestamp: new Date().toISOString(),
      }
      saveMemory(defaultData)
      return defaultData
    }

    const raw = fs.readFileSync(MEMORY_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('[Memory] Load failed:', err)
    return { context: {}, timestamp: new Date().toISOString() }
  }
}

export function saveMemory(data: MemoryData): void {
  try {
    fs.writeFileSync(MEMORY_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('[Memory] Save failed:', err)
  }
}
