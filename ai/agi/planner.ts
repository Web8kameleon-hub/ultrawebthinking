/**
 * Modul për planifikimin e hapave të ardhshëm në AGI.
 * Përgjegjëse për krijimin e planeve të bazuara në gjendjen aktuale dhe qëllimet.
 * 
 * Funksionalitetet kryesore:
 * - Analiza e gjendjes aktuale dhe prioritizimi i detyrave.
 * - Gjenerimi i një plani të veprimit bazuar në qëllimet dhe burimet.
 * - Mbështetje për prioritete dinamike dhe varësi ndërmjet detyrave.
 * - Optimizimi i planeve për efikasitet maksimal.
 */

export type Task = {
  id: string; // Identifikues unik për detyrën
  description: string; // Përshkrimi i detyrës
  priority: "low" | "medium" | "high"; // Prioriteti i detyrës
  dependencies?: string[]; // Lista e detyrave nga të cilat kjo detyrë varet
};

export type Plan = {
  tasks: Task[]; // Lista e detyrave të planifikuara
  optimized: boolean; // Tregon nëse plani është optimizuar
};

export class Planner {
  /**
   * Gjeneron një plan të veprimit bazuar në gjendjen aktuale dhe qëllimet.
   * @param state - Gjendja aktuale e sistemit.
   * @returns Një plan të optimizuar të veprimit.
   */
  generatePlan(state: Record<string, any>): Plan {
    const tasks = this.analyzeState(state);
    const optimizedTasks = this.optimizeTasks(tasks);

    return {
      tasks: optimizedTasks,
      optimized: true,
    };
  }

  /**
   * Analizon gjendjen aktuale dhe krijon një listë detyrash.
   * @param state - Gjendja aktuale e sistemit.
   * @returns Një listë detyrash të bazuara në gjendjen.
   */
  private analyzeState(state: Record<string, any>): Task[] {
    const tasks: Task[] = [];

    if (state.goal === "planning") {
      tasks.push({
        id: this.generateId(),
        description: "Krijo një plan për ditën.",
        priority: "high",
      });
    }

    if (state.goal === "assistance") {
      tasks.push({
        id: this.generateId(),
        description: "Ndihmo përdoruesin me kërkesën e tij.",
        priority: "medium",
      });
    }

    if (state.goal === "information_retrieval") {
      tasks.push({
        id: this.generateId(),
        description: "Kërko informacionin e kërkuar.",
        priority: "low",
      });
    }

    return tasks;
  }

  /**
   * Optimizon listën e detyrave duke marrë parasysh prioritetet dhe varësitë.
   * @param tasks - Lista e detyrave për t'u optimizuar.
   * @returns Një listë të optimizuar të detyrave.
   */
  private optimizeTasks(tasks: Task[]): Task[] {
    // Rendit detyrat sipas prioritetit (nga i larti te i ulti)
    return tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Gjeneron një ID unike për një detyrë.
   * @returns Një string unik për identifikimin e detyrës.
   */
  private generateId(): string {
    return crypto.randomUUID();
  }
}