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

import { initializeMind } from "./mind";
import { processInput } from "./sense";
import { generateResponse } from "./response";
import { planNextSteps } from "./planner";
import { monitor } from "./monitor";
import { Low, JSONFile } from "lowdb";

// Konfigurimi i bazës së të dhënave për ruajtjen e gjendjes
const adapter = new JSONFile("memory.json");
const db = new Low(adapter);

/**
 * Klasa kryesore që përfaqëson bërthamën e AGI-së.
 */
export class AGICore {
  private memory: Record<string, any> = {}; // Memorie për ruajtjen e gjendjes së sistemit

  /**
   * Ekzekuton ciklin kryesor të AGI-së.
   * @param input - Inputi i dhënë nga përdoruesi ose sistemi.
   * @returns Një përgjigje inteligjente bazuar në përpunimin e të dhënave.
   */
  async run(input: string): Promise<string> {
    monitor.log("🔍 AGI fillon përpunimin...", "info", { input });

    // Leximi i gjendjes nga baza e të dhënave
    await monitor.monitorExecution("db.read", async () => {
      await db.read();
      db.data ||= { memory: {} };
    });

    // Përpunimi i inputit përmes modulit të sensorëve
    const sensed = await monitor.monitorExecution("processInput", async () => processInput(input));
    monitor.log(`📥 Input i përpunuar: ${JSON.stringify(sensed)}`, "info");

    // Inicimi i mendjes kolektive me memorien dhe të dhënat e përpunuara
    const state = await monitor.monitorExecution("initializeMind", async () =>
      initializeMind(db.data.memory, sensed)
    );
    monitor.log(`🧠 Gjendja e mendjes: ${JSON.stringify(state)}`, "info");

    // Planifikimi i hapave të ardhshëm bazuar në gjendjen aktuale
    const plan = await monitor.monitorExecution("planNextSteps", async () => planNextSteps(state));
    monitor.log(`📋 Plani i krijuar: ${JSON.stringify(plan)}`, "info");

    // Gjenerimi i përgjigjes bazuar në gjendjen dhe planin
    const output = await monitor.monitorExecution("generateResponse", async () =>
      generateResponse(state, plan)
    );
    monitor.log(`💬 Përgjigja e gjeneruar: ${output}`, "info");

    // Ruajtja e gjendjes së përditësuar në bazën e të dhënave
    await monitor.monitorExecution("db.write", async () => {
      db.data.memory = state;
      await db.write();
    });

    monitor.log("✅ AGI përfundoi përpunimin.", "info");
    return output;
  }

  /**
   * Analizon tekstin duke përdorur një API të jashtme.
   * @param text - Teksti për analizë.
   * @returns Rezultati i analizës nga API.
   */
  private async analyzeWithAPI(text: string): Promise<any> {
    monitor.log("Duke analizuar tekstin me API të jashtme...", "info", { text });
    const response = await fetch("https://api.openai.com/v1/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({ text }),
    });
    const result = await response.json();
    monitor.log("Rezultati i analizës nga API u kthye me sukses.", "info", { result });
    return result;
  }
}

// Krijimi i një instance të AGICore për përdorim global
export const agi = new AGICore();

/**
 * Funksioni kryesor për të testuar AGI-në.
 */
async function main() {
  const input = "Cili është plani për sot?";
  const response = await agi.run(input);
  console.log("Përgjigja e AGI-së:", response);

  // Shfaqja e statistikave të sistemit
  console.log("Statistikat e Sistemit:", monitor.getSystemStats());

  // Eksportimi i log-eve
  console.log("Log-et e Eksportuara:", monitor.exportLogs());
}

main();
