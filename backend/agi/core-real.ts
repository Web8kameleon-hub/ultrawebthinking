/**
 * AGI Core - Real Implementation
 * Zero simulation, only real functions
 * @author Ledjan Ahmati
 * @version 8.0.0 Real
 */

import { promises as fs } from 'fs';
import path from 'path';
import { decideAction, type MindResult } from './mind';
import { logRealEvent as logEvent } from './monitor';
import { generateResponse } from './response';
import { analyzeInput, type SenseResult } from './sense';

interface ProcessResult {
  input: string;
  sense: SenseResult;
  mind: MindResult;
  response: string;
  timestamp: number;
}

export class AGICore {
  private static memoryPath = path.join(process.cwd(), 'backend', 'memory.json');

  /**
   * Main entry point - processes any input and returns real response
   */
  static async processInput(input: string): Promise<string> {
    if (!input || typeof input !== 'string' || !input.trim()) {
      return "⛔ Input bosh ose i pavlefshëm.";
    }

    try {
      const timestamp = Date.now();
      
      // Step 1: Analyze input (sense module)
      const senseResult = await analyzeInput(input.trim());
      
      // Step 2: Make decision (mind module)
      const mindResult = await decideAction(senseResult);
      
      // Step 3: Generate response (response module)
      const response = await generateResponse(mindResult);
      
      // Step 4: Log everything (monitor module)
      const processResult: ProcessResult = {
        input: input.trim(),
        sense: senseResult,
        mind: mindResult,
        response,
        timestamp
      };
      
      await logEvent(processResult);
      await this.saveToMemory(processResult);
      
      return response;
      
    } catch (error: any) {
      const errorMsg = `🚨 AGI Error: ${error.message}`;
      console.error('[AGI Core Error]', error);
      return errorMsg;
    }
  }

  /**
   * Save processing result to memory.json for learning
   */
  private static async saveToMemory(result: ProcessResult): Promise<void> {
    try {
      let memory: ProcessResult[] = [];
      
      // Read existing memory
      try {
        const data = await fs.readFile(this.memoryPath, 'utf-8');
        memory = JSON.parse(data);
      } catch {
        // File doesn't exist or is empty, start with empty array
        memory = [];
      }
      
      // Add new result
      memory.push(result);
      
      // Keep only last 1000 entries to prevent file bloat
      if (memory.length > 1000) {
        memory = memory.slice(-1000);
      }
      
      // Save back to file
      await fs.writeFile(this.memoryPath, JSON.stringify(memory, null, 2));
      
    } catch (error) {
      console.error('[AGI Memory Error]', error);
      // Don't throw - memory saving shouldn't break main flow
    }
  }

  /**
   * Get system status - real metrics only
   */
  static async getStatus(): Promise<any> {
    const memoryCount = await this.getMemoryCount();
    
    return {
      status: 'active',
      modules: {
        sense: 'loaded',
        mind: 'loaded', 
        response: 'loaded',
        monitor: 'loaded'
      },
      memory: {
        entries: memoryCount,
        path: this.memoryPath
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get memory entry count
   */
  private static async getMemoryCount(): Promise<number> {
    try {
      const data = await fs.readFile(this.memoryPath, 'utf-8');
      const memory = JSON.parse(data);
      return Array.isArray(memory) ? memory.length : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Clear memory (for testing/reset)
   */
  static async clearMemory(): Promise<void> {
    try {
      await fs.writeFile(this.memoryPath, '[]');
    } catch (error) {
      console.error('[AGI Clear Memory Error]', error);
    }
  }
}

export default AGICore;
