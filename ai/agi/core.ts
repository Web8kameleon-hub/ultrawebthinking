/**
 * Bërthama Qendrore e AGI (Artificial General Intelligence).
 * Përgjegjëse për orkestrimin e moduleve të tjera dhe menaxhimin e rrjedhës së të dhënave.
 */

import { initializeMind } from "./mind";
import { processInput } from "./sense";
import { generateResponse } from "./response";
import { planNextSteps } from "./planner";
import { monitor } from "./monitor";
import { Low, JSONFile } from "lowdb";
import { MindState } from "../types/agi.types";
import { BlobServiceClient } from "@azure/storage-blob";

// Konfigurimi i bazës së të dhënave për ruajtjen e gjendjes
const adapter = new JSONFile<{ memory: any }>("memory.json");
const db = new Low(adapter);

const blobServiceClient = BlobServiceClient.fromConnectionString("AZURE_STORAGE_CONNECTION_STRING");
const containerClient = blobServiceClient.getContainerClient("agi-memory");

/**
 * Klasa kryesore që përfaqëson bërthamën e AGI-së.
 */
export class AGICore {
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
    const state: MindState = await monitor.monitorExecution("initializeMind", async () =>
      initializeMind(db.data!.memory, sensed)
    );
    monitor.log(`🧠 Gjendja e mendjes: ${JSON.stringify(state)}`, "info");

    // Planifikimi i hapave të ardhshëm bazuar në gjendjen aktuale
    const plan = await monitor.monitorExecution("planNextSteps", async () =>
      planNextSteps(state)
    );
    monitor.log(`📋 Plani i krijuar: ${JSON.stringify(plan)}`, "info");

    // Gjenerimi i përgjigjes bazuar në gjendjen dhe planin
    const output = await monitor.monitorExecution("generateResponse", async () =>
      generateResponse(state, plan)
    );
    monitor.log(`💬 Përgjigja e gjeneruar: ${output}`, "info");

    // Ruajtja e gjendjes së përditësuar në bazën e të dhënave
    await monitor.monitorExecution("db.write", async () => {
      db.data!.memory = state;
      await db.write();
    });

    await this.persistStateToAzure(state);

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
    try {
      const response = await fetch("https://api.openai.com/v1/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_API_KEY`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Gabim nga API: ${response.statusText}`);
      }

      const result = await response.json();
      monitor.log("Rezultati i analizës nga API u kthye me sukses.", "info", { result });
      return result;
    } catch (error) {
      monitor.log("Gabim gjatë analizës me API.", "error", { error });
      throw error;
    }
  }

  private async persistStateToAzure(state: MindState): Promise<void> {
    const blockBlobClient = containerClient.getBlockBlobClient("memory.json");
    const data = JSON.stringify({ state, lastUpdated: new Date() });
    await blockBlobClient.upload(data, data.length);
  }
}

// Krijimi i një instance të AGICore për përdorim global
export const agi = new AGICore();

/**
 * Funksioni kryesor për të testuar AGI-në.
 */
async function main() {
  try {
    const input = "Cili është plani për sot?";
    const response = await agi.run(input);
    console.log("Përgjigja e AGI-së:", response);

    // Shfaqja e statistikave të sistemit
    console.log("Statistikat e Sistemit:", monitor.getSystemStats());

    // Eksportimi i log-eve
    console.log("Log-et e Eksportuara:", monitor.exportLogs());
  } catch (error) {
    console.error("Gabim gjatë ekzekutimit të AGI-së:", error);
  }
}

main();
