/**
 * Bërthama Qendrore e AGI (Artificial General Intelligence).
 * Përgjegjëse për orkestrimin e moduleve të tjera dhe menaxhimin e rrjedhës së të dhënave.
 * 
 * Funksionalitetet kryesore:
 * - Përpunimi i inputeve përmes modulit të sensorëve.
 * - Inicimi i "mendjes" kolektive për të ruajtur gjendjen.
 * - Planifikimi i hapave të ardhshëm bazuar në gjendjen aktuale.
 * - Gjenerimi i përgjigjeve inteligjente.
 * - Monitorimi i gjendjes dhe performancës së sistemit.
 */

// Ensure the correct path to the module
// Ensure the correct path to the module
import { processInput, someFunction } from "../agi/sense";
import { initializeMind } from "../agi/mind";
import { planNextSteps } from "../agi/planner";
import { generateResponse } from "../agi/response";
import { monitorState } from "../agi/monitor";

export class AgiCore {
  private memory: Record<string, any> = {}; // Memorie për ruajtjen e gjendjes së sistemit

  /**
   * Ekzekuton ciklin kryesor të AGI-së.
   * @param input - Inputi i dhënë nga përdoruesi ose sistemi.
   * @returns Një përgjigje inteligjente bazuar në përpunimin e të dhënave.
   */
  async run(input: string): Promise<string> {
    monitorState("🔍 AGI fillon përpunimin...", "info");

    // Përpunimi i inputit përmes modulit të sensorëve
    const sensed = await processInput(input);
    monitorState(`📥 Input i përpunuar: ${JSON.stringify(sensed)}`, "info");

    // Inicimi i mendjes kolektive me memorien dhe të dhënat e përpunuara
    const state = initializeMind(this.memory, sensed);
    monitorState(`🧠 Gjendja e mendjes: ${JSON.stringify(state)}`, "info");

    // Planifikimi i hapave të ardhshëm bazuar në gjendjen aktuale
    const plan = planNextSteps(state);
    monitorState(`📋 Plani i krijuar: ${JSON.stringify(plan)}`, "info");

    // Gjenerimi i përgjigjes bazuar në gjendjen dhe planin
    const output = generateResponse(state, plan);
    monitorState(`💬 Përgjigja e gjeneruar: ${output}`, "info");

    // Përditësimi i memorieve
    this.memory = state;

    monitorState("✅ AGI përfundoi përpunimin.", "info");
    return output;
  }
}

// Krijimi i një instance të AgiCore për përdorim global
export const agi = new AgiCore();

/**
 * Funksioni kryesor për të testuar AGI-në.
 */
async function main() {
  const input = "Cili është plani për sot?";
  const response = await agi.run(input);
  console.log("Përgjigja e AGI-së:", response);
}

main();