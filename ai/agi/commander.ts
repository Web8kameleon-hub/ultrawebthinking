/**
 * Komandanti i AGI-së – Koordinon çdo modul dhe ruan rendin.
 * 
 * Roli:
 * - Menaxhon ekzekutimin e kontrolluar të moduleve
 * - Mban një histori urdhrash dhe gjendjesh
 * - Siguron disiplinë dhe qëndrueshmëri në rrjedhën e operacioneve
 */

import { agi } from "./core"
import { monitor } from "./monitor"

type Command = {
  id: string
  issuedAt: number
  input: string
  issuedBy: string
  executed: boolean
  result?: string
  error?: string
}

export class Commander {
  private history: Command[] = []

  /**
   * Jep një urdhër për ekzekutim në sistemin AGI
   * @param input - Urdhëri (pyetje apo komandë)
   * @param by - Burimi i urdhërit (njerëzor, API, sistem)
   */
  async issue(input: string, by = "operator"): Promise<string> {
    if (!input.trim()) {
      const message = "Komanda bosh nuk mund të ekzekutohet"
      monitor.log(`⚠️ ${message}`, "warning")
      this.addToHistory({
        id: crypto.randomUUID(),
        issuedAt: Date.now(),
        input,
        issuedBy: by,
        executed: false,
        result: message,
      })
      return message
    }

    const command: Command = {
      id: crypto.randomUUID(),
      issuedAt: Date.now(),
      input,
      issuedBy: by,
      executed: false,
    }

    monitor.log(`🪖 Komandë e re nga ${by}: "${input}"`, "info")
    this.addToHistory(command)

    try {
      const output = await agi.run(input)
      command.executed = true
      command.result = output
      monitor.log(`✅ Përgjigje e komandës "${input}": ${output}`, "info")
      return output
    } catch (error: any) {
      const errorMessage = error?.message || "Gabim i panjohur"
      monitor.log(`❌ Dështim gjatë ekzekutimit të komandës: "${input}"`, "error", { error })
      command.executed = false
      command.result = "Gabim gjatë ekzekutimit"
      command.error = errorMessage
      return "Gabim gjatë përpunimit të komandës"
    }
  }

  /**
   * Rikthen historinë e komandave të dhëna
   * @param filterBy - Opsionale: Filtron historinë sipas përdoruesit
   */
  getHistory(filterBy?: string): Command[] {
    if (filterBy) {
      return this.history.filter(command => command.issuedBy === filterBy)
    }
    return this.history
  }

  /**
   * Pastron historinë e komandave
   */
  clearHistory(): void {
    const totalCommands = this.history.length
    this.history = []
    monitor.log(`🧹 Historia e komandave u fshi. Totali: ${totalCommands}`, "info")
  }

  /**
   * Shton një komandë në histori
   * @param command - Komanda që do të shtohet
   */
  private addToHistory(command: Command): void {
    this.history.push(command)
  }
}

// Eksport global
export const commander = new Commander()
