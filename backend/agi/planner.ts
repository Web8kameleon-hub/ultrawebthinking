// backend/agi/planner.ts
/**
 * Planner.ts
 * Planifikues strategjik për detyra AGI
 * © Web8 UltraThinking – Ledjan Ahmati
 */

interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number; // in minutes
  dependencies: string[];
  resources: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
}

interface Plan {
  id: string;
  objective: string;
  tasks: Task[];
  timeline: number; // total estimated time
  complexity: number; // 1-10 scale
  successProbability: number; // 0-100%
  risks: string[];
  recommendations: string[];
}

export class Planner {
  /**
   * Gjeneron një plan të detajuar për një objektiv
   */
  static async generatePlan(objective: string): Promise<any> {
    const tasks = this.breakDownObjective(objective);
    const timeline = this.calculateTimeline(tasks);
    const complexity = this.assessComplexity(objective, tasks);
    const risks = this.identifyRisks(objective, tasks);
    const recommendations = this.generateRecommendations(tasks, complexity);
    
    const plan: Plan = {
      id: `plan-${Date.now()}`,
      objective,
      tasks,
      timeline,
      complexity,
      successProbability: this.calculateSuccessProbability(complexity, tasks.length),
      risks,
      recommendations
    };

    return {
      success: true,
      data: plan,
      summary: {
        totalTasks: tasks.length,
        estimatedDuration: `${Math.round(timeline / 60)} hours ${timeline % 60} minutes`,
        complexityLevel: this.getComplexityLabel(complexity),
        readiness: this.assessReadiness(plan)
      },
      timestamp: new Date().toISOString()
    };
  }

  private static breakDownObjective(objective: string): Task[] {
    const tasks: Task[] = [];
    
    // Analizojmë objektivin dhe krijojmë detyra bazë
    const keywords = objective.toLowerCase();
    
    // Detyra të përgjithshme që aplikohen për shumicën e projekteve
    if (keywords.includes('build') || keywords.includes('create') || keywords.includes('develop')) {
      tasks.push({
        id: 'task-analysis',
        name: 'Requirement Analysis',
        description: 'Analyze and document all requirements',
        priority: 'high',
        estimatedTime: 120,
        dependencies: [],
        resources: ['analyst', 'documentation'],
        status: 'pending'
      });

      tasks.push({
        id: 'task-design',
        name: 'System Design',
        description: 'Create technical design and architecture',
        priority: 'high',
        estimatedTime: 180,
        dependencies: ['task-analysis'],
        resources: ['architect', 'designer'],
        status: 'pending'
      });

      tasks.push({
        id: 'task-implementation',
        name: 'Implementation',
        description: 'Develop the actual solution',
        priority: 'critical',
        estimatedTime: 480,
        dependencies: ['task-design'],
        resources: ['developer', 'tools'],
        status: 'pending'
      });

      tasks.push({
        id: 'task-testing',
        name: 'Testing & QA',
        description: 'Test functionality and ensure quality',
        priority: 'high',
        estimatedTime: 120,
        dependencies: ['task-implementation'],
        resources: ['tester', 'testing-tools'],
        status: 'pending'
      });
    }

    // Detyra specifike bazuar në fjalë kyçe
    if (keywords.includes('api') || keywords.includes('service')) {
      tasks.push({
        id: 'task-api-design',
        name: 'API Design',
        description: 'Design RESTful API endpoints and documentation',
        priority: 'high',
        estimatedTime: 90,
        dependencies: ['task-analysis'],
        resources: ['api-designer', 'documentation'],
        status: 'pending'
      });
    }

    if (keywords.includes('database') || keywords.includes('data')) {
      tasks.push({
        id: 'task-database',
        name: 'Database Design',
        description: 'Design database schema and relationships',
        priority: 'high',
        estimatedTime: 150,
        dependencies: ['task-analysis'],
        resources: ['database-architect', 'modeling-tools'],
        status: 'pending'
      });
    }

    if (keywords.includes('ui') || keywords.includes('interface') || keywords.includes('frontend')) {
      tasks.push({
        id: 'task-ui-design',
        name: 'UI/UX Design',
        description: 'Design user interface and experience',
        priority: 'medium',
        estimatedTime: 200,
        dependencies: ['task-analysis'],
        resources: ['ui-designer', 'design-tools'],
        status: 'pending'
      });
    }

    // Nëse nuk ka detyra specifike, shtojmë detyra të përgjithshme
    if (tasks.length === 0) {
      tasks.push({
        id: 'task-research',
        name: 'Research & Planning',
        description: 'Research the topic and create initial plan',
        priority: 'high',
        estimatedTime: 60,
        dependencies: [],
        resources: ['researcher'],
        status: 'pending'
      });

      tasks.push({
        id: 'task-execution',
        name: 'Execute Plan',
        description: 'Execute the planned activities',
        priority: 'critical',
        estimatedTime: 120,
        dependencies: ['task-research'],
        resources: ['executor'],
        status: 'pending'
      });
    }

    // Shtojmë detyra mbyllëse
    tasks.push({
      id: 'task-review',
      name: 'Review & Optimization',
      description: 'Review results and optimize if needed',
      priority: 'medium',
      estimatedTime: 60,
      dependencies: tasks.map(t => t.id),
      resources: ['reviewer'],
      status: 'pending'
    });

    return tasks;
  }

  private static calculateTimeline(tasks: Task[]): number {
    return tasks.reduce((total, task) => total + task.estimatedTime, 0);
  }

  private static assessComplexity(objective: string, tasks: Task[]): number {
    let complexity = 5; // base complexity

    // Rrisim kompleksitetin bazuar në fjalë kyçe
    const complexKeywords = [
      'ai', 'machine learning', 'deep learning', 'neural network',
      'blockchain', 'cryptocurrency', 'distributed system',
      'real-time', 'high-performance', 'scalable', 'enterprise'
    ];

    complexKeywords.forEach(keyword => {
      if (objective.toLowerCase().includes(keyword)) {
        complexity += 1;
      }
    });

    // Rrisim kompleksitetin bazuar në numrin e detyrave
    complexity += Math.min(3, Math.floor(tasks.length / 3));

    return Math.min(10, complexity);
  }

  private static identifyRisks(objective: string, tasks: Task[]): string[] {
    const risks: string[] = [];

    // Rreziqe të përgjithshme
    if (tasks.length > 8) {
      risks.push('High task complexity may lead to scope creep');
    }

    if (tasks.some(t => t.estimatedTime > 300)) {
      risks.push('Long-duration tasks may face resource constraints');
    }

    // Rreziqe specifike
    if (objective.toLowerCase().includes('real-time')) {
      risks.push('Real-time requirements may introduce performance bottlenecks');
    }

    if (objective.toLowerCase().includes('integration')) {
      risks.push('Third-party integrations may introduce dependencies and delays');
    }

    // Rrezik i paracaktuar nëse nuk ka të tjera
    if (risks.length === 0) {
      risks.push('Standard project risks apply (timeline, budget, scope changes)');
    }

    return risks;
  }

  private static generateRecommendations(tasks: Task[], complexity: number): string[] {
    const recommendations: string[] = [];

    if (complexity > 7) {
      recommendations.push('Consider breaking down into smaller phases');
      recommendations.push('Implement thorough testing at each stage');
    }

    if (tasks.length > 6) {
      recommendations.push('Use project management tools for task tracking');
    }

    recommendations.push('Maintain regular communication with stakeholders');
    recommendations.push('Document all decisions and changes');
    recommendations.push('Plan for contingencies and buffer time');

    return recommendations;
  }

  private static calculateSuccessProbability(complexity: number, taskCount: number): number {
    let probability = 85; // base probability

    // Ulet probabiliteti me kompleksitetin
    probability -= (complexity - 5) * 5;

    // Ulet probabiliteti me numrin e detyrave
    if (taskCount > 8) {
      probability -= (taskCount - 8) * 2;
    }

    return Math.max(30, Math.min(95, probability));
  }

  private static getComplexityLabel(complexity: number): string {
    if (complexity <= 3) return 'Low';
    if (complexity <= 6) return 'Medium';
    if (complexity <= 8) return 'High';
    return 'Very High';
  }

  private static assessReadiness(plan: Plan): string {
    if (plan.successProbability > 80 && plan.complexity <= 6) {
      return 'Ready to proceed';
    } else if (plan.successProbability > 60) {
      return 'Proceed with caution';
    } else {
      return 'Requires further planning';
    }
  }
}
