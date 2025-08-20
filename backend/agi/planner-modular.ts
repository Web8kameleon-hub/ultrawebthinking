// backend/agi/planner-modular.ts
/**
 * Planner.ts - Real Modular Instance-Based Architecture
 * Planifikues strategjik për detyra AGI
 * © Web8 UltraThinking – Ledjan Ahmati
 */

interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dependencies: string[];
  estimated_duration: number;
  created_at: number;
  updated_at: number;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  total_duration: number;
  completion_percentage: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: number;
  updated_at: number;
}

interface PlanningContext {
  session?: any;
  constraints?: {
    time_limit?: number;
    resources?: string[];
    priorities?: string[];
  };
  goals?: string[];
  preferences?: Record<string, any>;
}

export class Planner {
  private activePlans: Map<string, Plan> = new Map();
  private taskTemplates: Map<string, Partial<Task>> = new Map();
  private planningHistory: Map<string, any> = new Map();
  private optimizationRules: Map<string, any> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeOptimizationRules();
  }

  private initializeTemplates(): void {
    // Initialize common task templates
    this.taskTemplates.set('analysis', {
      name: 'Data Analysis',
      description: 'Analyze provided data and extract insights',
      priority: 'normal',
      estimated_duration: 300000, // 5 minutes in ms
    });

    this.taskTemplates.set('optimization', {
      name: 'System Optimization',
      description: 'Optimize system performance and efficiency',
      priority: 'high',
      estimated_duration: 600000, // 10 minutes in ms
    });

    this.taskTemplates.set('configuration', {
      name: 'Configuration Setup',
      description: 'Configure system settings and parameters',
      priority: 'normal',
      estimated_duration: 180000, // 3 minutes in ms
    });
  }

  private initializeOptimizationRules(): void {
    this.optimizationRules.set('parallel_execution', {
      description: 'Tasks with no dependencies can run in parallel',
      priority: 1,
      condition: (tasks: Task[]) => tasks.filter(t => t.dependencies.length === 0).length > 1
    });

    this.optimizationRules.set('priority_ordering', {
      description: 'Higher priority tasks should execute first',
      priority: 2,
      condition: () => true
    });

    this.optimizationRules.set('dependency_resolution', {
      description: 'Dependencies must be resolved before dependent tasks',
      priority: 3,
      condition: (tasks: Task[]) => tasks.some(t => t.dependencies.length > 0)
    });
  }

  /**
   * Create a comprehensive plan from input
   */
  async createPlan(input: string, context?: PlanningContext): Promise<Plan> {
    const planId = `plan_${Date.now()}`;
    const planName = this.extractPlanName(input);
    const planDescription = this.extractPlanDescription(input);

    // Analyze input to identify required tasks
    const taskRequirements = await this.analyzeTaskRequirements(input, context);
    
    // Generate tasks based on requirements
    const tasks = await this.generateTasks(taskRequirements, context);
    
    // Optimize task order and dependencies
    const optimizedTasks = await this.optimizeTasks(tasks, context);
    
    // Calculate total duration
    const totalDuration = this.calculateTotalDuration(optimizedTasks);

    const plan: Plan = {
      id: planId,
      name: planName,
      description: planDescription,
      tasks: optimizedTasks,
      total_duration: totalDuration,
      completion_percentage: 0,
      status: 'draft',
      created_at: Date.now(),
      updated_at: Date.now()
    };

    // Store plan
    this.activePlans.set(planId, plan);
    this.planningHistory.set(planId, {
      input,
      context,
      created_at: Date.now(),
      analysis: taskRequirements
    });

    return plan;
  }

  /**
   * Create optimization plan for system metrics
   */
  async createOptimizationPlan(metrics: any): Promise<any> {
    const optimizations = [];

    // CPU optimization
    if (metrics.cpu && metrics.cpu.usage > 80) {
      optimizations.push({
        type: 'cpu_optimization',
        description: 'Reduce CPU usage through process optimization',
        priority: 'high',
        estimated_impact: 25,
        actions: [
          'Identify high-CPU processes',
          'Optimize algorithms',
          'Implement caching',
          'Scale horizontally'
        ]
      });
    }

    // Memory optimization
    if (metrics.memory && metrics.memory.usage > 85) {
      optimizations.push({
        type: 'memory_optimization',
        description: 'Optimize memory usage and prevent leaks',
        priority: 'high',
        estimated_impact: 30,
        actions: [
          'Garbage collection tuning',
          'Memory leak detection',
          'Object pooling',
          'Lazy loading implementation'
        ]
      });
    }

    // Network optimization
    if (metrics.network && metrics.network.latency > 100) {
      optimizations.push({
        type: 'network_optimization',
        description: 'Improve network performance and reduce latency',
        priority: 'normal',
        estimated_impact: 20,
        actions: [
          'Connection pooling',
          'Request batching',
          'CDN implementation',
          'Compression optimization'
        ]
      });
    }

    // Database optimization
    if (metrics.database && metrics.database.query_time > 50) {
      optimizations.push({
        type: 'database_optimization',
        description: 'Optimize database queries and connections',
        priority: 'normal',
        estimated_impact: 35,
        actions: [
          'Query optimization',
          'Index creation',
          'Connection pooling',
          'Caching strategies'
        ]
      });
    }

    return {
      plan_id: `opt_plan_${Date.now()}`,
      total_optimizations: optimizations.length,
      estimated_total_impact: optimizations.reduce((sum, opt) => sum + opt.estimated_impact, 0),
      optimizations,
      recommendations: this.generateRecommendations(optimizations),
      priority_order: this.prioritizeOptimizations(optimizations),
      created_at: new Date().toISOString()
    };
  }

  /**
   * Update plan status and progress
   */
  async updatePlan(planId: string, updates: Partial<Plan>): Promise<boolean> {
    const plan = this.activePlans.get(planId);
    if (!plan) return false;

    Object.assign(plan, updates, { updated_at: Date.now() });
    
    // Recalculate completion percentage
    if (updates.tasks) {
      plan.completion_percentage = this.calculateCompletionPercentage(plan.tasks);
    }

    this.activePlans.set(planId, plan);
    return true;
  }

  /**
   * Get plan by ID
   */
  getPlan(planId: string): Plan | undefined {
    return this.activePlans.get(planId);
  }

  /**
   * Get all active plans
   */
  getAllPlans(): Plan[] {
    return Array.from(this.activePlans.values());
  }

  private extractPlanName(input: string): string {
    // Extract meaningful plan name from input
    const words = input.split(/\s+/).slice(0, 5);
    return words.join(' ').replace(/[^\w\s]/g, '') || 'Generated Plan';
  }

  private extractPlanDescription(input: string): string {
    // Create description based on input
    if (input.length > 100) {
      return input.substring(0, 97) + '...';
    }
    return input;
  }

  private async analyzeTaskRequirements(input: string, context?: PlanningContext): Promise<any> {
    const requirements = {
      analysis_needed: /analyz|examin|investigat|study/i.test(input),
      optimization_needed: /optim|improv|enhanc|boost/i.test(input),
      configuration_needed: /configur|setup|install|settings/i.test(input),
      data_processing: /process|transform|convert|parse/i.test(input),
      system_monitoring: /monitor|track|observe|watch/i.test(input),
      reporting: /report|summary|document|export/i.test(input),
      automation: /automat|schedul|batch|recurring/i.test(input),
      integration: /integrat|connect|link|sync/i.test(input)
    };

    const complexity = this.assessComplexity(input, context);
    const urgency = this.assessUrgency(input, context);
    const resources = this.identifyRequiredResources(input, context);

    return {
      requirements,
      complexity,
      urgency,
      resources,
      estimated_tasks: Object.values(requirements).filter(Boolean).length
    };
  }

  private async generateTasks(requirements: any, context?: PlanningContext): Promise<Task[]> {
    const tasks: Task[] = [];
    let taskCounter = 1;

    // Generate tasks based on requirements
    Object.entries(requirements.requirements).forEach(([reqType, needed]) => {
      if (needed) {
        const template = this.getTaskTemplate(reqType);
        const task: Task = {
          id: `task_${taskCounter++}_${Date.now()}`,
          name: template.name || this.generateTaskName(reqType),
          description: template.description || this.generateTaskDescription(reqType),
          priority: this.adjustPriority(template.priority || 'normal', requirements.urgency),
          status: 'pending',
          dependencies: this.determineDependencies(reqType, tasks),
          estimated_duration: this.adjustDuration(template.estimated_duration || 300000, requirements.complexity),
          created_at: Date.now(),
          updated_at: Date.now()
        };

        tasks.push(task);
      }
    });

    // Add coordination tasks if multiple tasks exist
    if (tasks.length > 3) {
      tasks.push({
        id: `coordination_${Date.now()}`,
        name: 'Task Coordination',
        description: 'Coordinate and monitor task execution',
        priority: 'normal',
        status: 'pending',
        dependencies: [],
        estimated_duration: 60000, // 1 minute
        created_at: Date.now(),
        updated_at: Date.now()
      });
    }

    return tasks;
  }

  private async optimizeTasks(tasks: Task[], context?: PlanningContext): Promise<Task[]> {
    let optimizedTasks = [...tasks];

    // Apply optimization rules
    for (const [ruleName, rule] of this.optimizationRules) {
      if (rule.condition(optimizedTasks)) {
        optimizedTasks = this.applyOptimizationRule(ruleName, optimizedTasks);
      }
    }

    // Sort by priority and dependencies
    optimizedTasks = this.sortTasksByDependencies(optimizedTasks);

    return optimizedTasks;
  }

  private calculateTotalDuration(tasks: Task[]): number {
    // Calculate critical path duration
    const dependencyGraph = this.buildDependencyGraph(tasks);
    return this.calculateCriticalPath(dependencyGraph, tasks);
  }

  private calculateCompletionPercentage(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  }

  private getTaskTemplate(reqType: string): Partial<Task> {
    return this.taskTemplates.get(reqType) || {};
  }

  private generateTaskName(reqType: string): string {
    const names: Record<string, string> = {
      analysis_needed: 'Data Analysis Task',
      optimization_needed: 'System Optimization',
      configuration_needed: 'Configuration Setup',
      data_processing: 'Data Processing',
      system_monitoring: 'System Monitoring',
      reporting: 'Report Generation',
      automation: 'Process Automation',
      integration: 'System Integration'
    };
    return names[reqType] || 'Generic Task';
  }

  private generateTaskDescription(reqType: string): string {
    const descriptions: Record<string, string> = {
      analysis_needed: 'Perform comprehensive analysis of the provided data',
      optimization_needed: 'Optimize system performance and efficiency',
      configuration_needed: 'Configure system settings and parameters',
      data_processing: 'Process and transform data according to requirements',
      system_monitoring: 'Monitor system performance and health metrics',
      reporting: 'Generate comprehensive reports and documentation',
      automation: 'Implement automated processes and workflows',
      integration: 'Integrate systems and ensure data synchronization'
    };
    return descriptions[reqType] || 'Execute the required task';
  }

  private assessComplexity(input: string, context?: PlanningContext): 'low' | 'medium' | 'high' {
    let complexity = 0;
    
    if (input.length > 100) complexity += 1;
    if (/multiple|several|various|complex|advanced/i.test(input)) complexity += 1;
    if (context?.constraints?.time_limit && context.constraints.time_limit < 600000) complexity += 1;
    if (context?.goals && context.goals.length > 3) complexity += 1;

    if (complexity >= 3) return 'high';
    if (complexity >= 1) return 'medium';
    return 'low';
  }

  private assessUrgency(input: string, context?: PlanningContext): 'low' | 'normal' | 'high' | 'critical' {
    if (/urgent|critical|immediate|asap|emergency/i.test(input)) return 'critical';
    if (/soon|quickly|fast|priority/i.test(input)) return 'high';
    if (/later|eventually|when possible/i.test(input)) return 'low';
    return 'normal';
  }

  private identifyRequiredResources(input: string, context?: PlanningContext): string[] {
    const resources = [];
    
    if (/database|data|storage/i.test(input)) resources.push('database');
    if (/network|api|service/i.test(input)) resources.push('network');
    if (/cpu|processing|computation/i.test(input)) resources.push('cpu');
    if (/memory|ram|cache/i.test(input)) resources.push('memory');
    if (/file|document|export/i.test(input)) resources.push('filesystem');

    return resources;
  }

  private adjustPriority(basePriority: string, urgency: string): 'low' | 'normal' | 'high' | 'critical' {
    if (urgency === 'critical') return 'critical';
    if (urgency === 'high' && basePriority !== 'low') return 'high';
    if (urgency === 'low') return 'low';
    return basePriority as 'low' | 'normal' | 'high' | 'critical';
  }

  private adjustDuration(baseDuration: number, complexity: string): number {
    const multipliers = { low: 0.8, medium: 1.0, high: 1.5 };
    return Math.round(baseDuration * (multipliers[complexity as keyof typeof multipliers] || 1.0));
  }

  private determineDependencies(reqType: string, existingTasks: Task[]): string[] {
    const dependencies: string[] = [];

    // Define dependency rules
    if (reqType === 'optimization_needed' && existingTasks.some(t => t.name.includes('Analysis'))) {
      const analysisTask = existingTasks.find(t => t.name.includes('Analysis'));
      if (analysisTask) dependencies.push(analysisTask.id);
    }

    if (reqType === 'reporting' && existingTasks.length > 0) {
      // Reports typically depend on other tasks being completed
      dependencies.push(...existingTasks.slice(0, Math.min(2, existingTasks.length)).map(t => t.id));
    }

    return dependencies;
  }

  private applyOptimizationRule(ruleName: string, tasks: Task[]): Task[] {
    switch (ruleName) {
      case 'priority_ordering':
        return tasks.sort((a, b) => {
          const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      
      case 'dependency_resolution':
        return this.sortTasksByDependencies(tasks);
      
      default:
        return tasks;
    }
  }

  private sortTasksByDependencies(tasks: Task[]): Task[] {
    const sorted: Task[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (task: Task) => {
      if (visiting.has(task.id)) {
        throw new Error(`Circular dependency detected involving task ${task.id}`);
      }
      if (visited.has(task.id)) return;

      visiting.add(task.id);
      
      task.dependencies.forEach(depId => {
        const depTask = tasks.find(t => t.id === depId);
        if (depTask) visit(depTask);
      });

      visiting.delete(task.id);
      visited.add(task.id);
      sorted.push(task);
    };

    tasks.forEach(task => {
      if (!visited.has(task.id)) {
        visit(task);
      }
    });

    return sorted;
  }

  private buildDependencyGraph(tasks: Task[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    tasks.forEach(task => {
      graph.set(task.id, task.dependencies);
    });

    return graph;
  }

  private calculateCriticalPath(graph: Map<string, string[]>, tasks: Task[]): number {
    // Simplified critical path calculation
    const taskDurations = new Map(tasks.map(t => [t.id, t.estimated_duration]));
    let maxDuration = 0;

    tasks.forEach(task => {
      const pathDuration = this.calculatePathDuration(task.id, graph, taskDurations, new Set());
      maxDuration = Math.max(maxDuration, pathDuration);
    });

    return maxDuration;
  }

  private calculatePathDuration(taskId: string, graph: Map<string, string[]>, durations: Map<string, number>, visited: Set<string>): number {
    if (visited.has(taskId)) return 0; // Circular dependency protection
    
    visited.add(taskId);
    const taskDuration = durations.get(taskId) || 0;
    const dependencies = graph.get(taskId) || [];
    
    let maxDepDuration = 0;
    dependencies.forEach(depId => {
      const depDuration = this.calculatePathDuration(depId, graph, durations, new Set(visited));
      maxDepDuration = Math.max(maxDepDuration, depDuration);
    });

    return taskDuration + maxDepDuration;
  }

  private generateRecommendations(optimizations: any[]): string[] {
    const recommendations = [];
    
    if (optimizations.length > 3) {
      recommendations.push('Consider implementing optimizations in phases to minimize system disruption');
    }
    
    const highPriorityCount = optimizations.filter(opt => opt.priority === 'high').length;
    if (highPriorityCount > 1) {
      recommendations.push('Focus on high-priority optimizations first for maximum impact');
    }

    const totalImpact = optimizations.reduce((sum, opt) => sum + opt.estimated_impact, 0);
    if (totalImpact > 80) {
      recommendations.push('Significant performance improvements expected - monitor system closely during implementation');
    }

    return recommendations;
  }

  private prioritizeOptimizations(optimizations: any[]): any[] {
    return optimizations.sort((a, b) => {
      // Sort by priority first, then by estimated impact
      const priorityOrder: Record<string, number> = { critical: 4, high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 1;
      const bPriority = priorityOrder[b.priority] || 1;
      const priorityDiff = bPriority - aPriority;
      
      if (priorityDiff !== 0) return priorityDiff;
      return b.estimated_impact - a.estimated_impact;
    });
  }

  /**
   * Get planner statistics
   */
  getStats(): any {
    const plans = Array.from(this.activePlans.values());
    
    return {
      total_plans: plans.length,
      active_plans: plans.filter(p => p.status === 'active').length,
      completed_plans: plans.filter(p => p.status === 'completed').length,
      total_tasks: plans.reduce((sum, p) => sum + p.tasks.length, 0),
      avg_completion: plans.reduce((sum, p) => sum + p.completion_percentage, 0) / Math.max(1, plans.length),
      optimization_rules: this.optimizationRules.size,
      task_templates: this.taskTemplates.size,
      planning_sessions: this.planningHistory.size,
      last_plan_created: plans.length > 0 ? Math.max(...plans.map(p => p.created_at)) : null
    };
  }

  /**
   * Export planner data
   */
  exportData(): any {
    return {
      active_plans: Object.fromEntries(this.activePlans),
      task_templates: Object.fromEntries(this.taskTemplates),
      planning_history: Object.fromEntries(this.planningHistory),
      optimization_rules: Object.fromEntries(this.optimizationRules),
      exported_at: new Date().toISOString()
    };
  }
}
