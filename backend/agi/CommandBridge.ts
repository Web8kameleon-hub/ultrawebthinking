// backend/agi/CommandBridge.ts
/**
 * CommandBridge.ts
 * Lidhës ndërmjet UI (AGISheet) dhe AGICore për ekzekutim komandash AGI
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { AGICore } from './core'
import { SemanticAnalyzer } from './semantic'
import { Planner } from './planner'
import { Executor } from './executor'
import { logger } from './monitor'

// Komandat e mbështetura
type AGICommand =
  | 'ANALYZE'
  | 'CLASSIFY'
  | 'PLAN'
  | 'EXECUTE'
  | 'STATUS'
  | 'RESET'

interface CommandPayload {
  id: string
  command: AGICommand
  input: string
  context?: Record<string, any>
}

export class CommandBridge {
  static async handle(cmd: CommandPayload): Promise<any> {
    logger.info(`[CommandBridge] Command received: ${cmd.command}`)

    switch (cmd.command) {
      case 'ANALYZE':
        return SemanticAnalyzer.parse(cmd.input)

      case 'CLASSIFY':
        return SemanticAnalyzer.classify(cmd.input)

      case 'PLAN':
        return Planner.generatePlan(cmd.input)

      case 'EXECUTE':
        return Executor.run(cmd.input)

      case 'STATUS':
        return AGICore.status()

      case 'RESET':
        return AGICore.reset()

      default:
        throw new Error(`Unknown command: ${cmd.command}`)
    }
  }
}
