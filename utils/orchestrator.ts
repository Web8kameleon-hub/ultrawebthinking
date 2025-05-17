import { AGICore } from "../ai/agi/core";
import { monitor } from "../ai/agi/monitor";

/**
 * Orchestrator - Komandanti dhe organizatori kryesor për AGI.
 * Përgjegjës për koordinimin e moduleve dhe menaxhimin e rrjedhës së të dhënave.
 */
export class Orchestrator {
  private agi: AGICore;

  constructor() {
    this.agi = new AGICore();
  }

  /**
   * Ekzekuton një komandë të dhënë dhe menaxhon rrjedhën e të dhënave.
   * @param input - Komanda ose pyetja e dhënë nga përdoruesi.
   * @returns Një përgjigje inteligjente nga AGI.
   */
  async execute(input: string): Promise<string> {
    monitor.log(`🎯 Orchestrator pranoi input: "${input}"`, "info");

    try {
      // Ekzekutimi i logjikës kryesore të AGI-së
      const response = await this.agi.run(input);
      monitor.log(`✅ Përgjigja nga AGICore: "${response}"`, "info");
      return response;
    } catch (error: unknown) {
      monitor.log(`❌ Gabim gjatë ekzekutimit të komandës: ${error}`, "error");
      throw new Error("Gabim gjatë përpunimit të komandës.");
    }
  }

  /**
   * Menaxhon një grup komandash në mënyrë të organizuar.
   * @param inputs - Një listë komandash ose pyetjesh.
   * @returns Një listë përgjigjesh nga AGI.
   */
  async executeBatch(inputs: string[]): Promise<string[]> {
    monitor.log(`📋 Orchestrator po përpunon një grup komandash: ${inputs.length}`, "info");

    const responses: string[] = [];
    for (const input of inputs) {
      try {
        const response = await this.execute(input);
        responses.push(response);
      } catch (error) {
        responses.push("Gabim gjatë përpunimit të kësaj komande.");
      }
    }

    monitor.log(`📦 Përpunimi i grupit përfundoi. Përgjigjet: ${responses}`, "info");
    return responses;
  }
}

// Krijimi i një instance globale të Orchestrator për përdorim të lehtë
export const orchestrator = new Orchestrator();

declare module "./orchestrator" {
  export function orchestrate(): void;
}