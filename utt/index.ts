/**
 * UTT (Universal Task Tracker) Service
 * Advanced task management and workflow orchestration
 * 
 * @author EuroWeb Platform
 * @version 8.0.0
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'ai' | 'compute' | 'data' | 'network' | 'system';
  progress: number; // 0-100
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  dependencies?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TaskGroup {
  id: string;
  name: string;
  tasks: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  parallelExecution: boolean;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'task' | 'condition' | 'parallel' | 'wait';
  config: Record<string, any>;
  nextSteps: string[];
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'manual';
  config: Record<string, any>;
}

export class UTTService {
  private tasks: Map<string, Task> = new Map();
  private taskGroups: Map<string, TaskGroup> = new Map();
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private activeWorkflows: Map<string, any> = new Map();

  constructor() {
    this.initializeSystemTasks();
  }

  private initializeSystemTasks() {
    const systemTasks: Task[] = [
      {
        id: 'agi-monitoring',
        title: 'AGI System Monitoring',
        description: 'Continuous monitoring of AGI core systems',
        status: 'running',
        priority: 'high',
        type: 'ai',
        progress: 75,
        createdAt: Date.now() - 3600000,
        startedAt: Date.now() - 3600000,
        tags: ['system', 'monitoring', 'agi']
      },
      {
        id: 'neural-training',
        title: 'Neural Model Training',
        description: 'Training neural networks with latest data',
        status: 'running',
        priority: 'medium',
        type: 'ai',
        progress: 45,
        createdAt: Date.now() - 1800000,
        startedAt: Date.now() - 1800000,
        estimatedDuration: 7200000, // 2 hours
        tags: ['neural', 'training', 'ai']
      },
      {
        id: 'mesh-sync',
        title: 'Mesh Network Synchronization',
        description: 'Synchronizing data across mesh network nodes',
        status: 'completed',
        priority: 'medium',
        type: 'network',
        progress: 100,
        createdAt: Date.now() - 900000,
        startedAt: Date.now() - 900000,
        completedAt: Date.now() - 300000,
        actualDuration: 600000,
        tags: ['mesh', 'sync', 'network']
      }
    ];

    systemTasks.forEach(task => this.tasks.set(task.id, task));
    console.log('📋 UTT initialized with', systemTasks.length, 'system tasks');
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'progress' | 'status'>): Promise<string> {
    const task: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
      progress: 0,
      status: 'pending'
    };

    this.tasks.set(task.id, task);
    console.log('✅ Task created:', task.id, '-', task.title);
    
    return task.id;
  }

  async startTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status !== 'pending' && task.status !== 'paused') {
      throw new Error(`Task ${taskId} cannot be started (current status: ${task.status})`);
    }

    // Check dependencies
    if (task.dependencies) {
      for (const depId of task.dependencies) {
        const depTask = this.tasks.get(depId);
        if (!depTask || depTask.status !== 'completed') {
          throw new Error(`Dependency ${depId} not completed`);
        }
      }
    }

    task.status = 'running';
    task.startedAt = Date.now();
    
    console.log('🚀 Task started:', taskId);
    
    // Simulate task execution
    this.simulateTaskExecution(taskId);
    
    return true;
  }

  private async simulateTaskExecution(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const updateInterval = setInterval(() => {
      if (task.status !== 'running') {
        clearInterval(updateInterval);
        return;
      }

      task.progress = Math.min(100, task.progress + Math.random() * 20);
      
      if (task.progress >= 100) {
        task.status = 'completed';
        task.completedAt = Date.now();
        task.actualDuration = Date.now() - (task.startedAt || task.createdAt);
        clearInterval(updateInterval);
        console.log('✅ Task completed:', taskId);
      }
    }, 1000);
  }

  async pauseTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'running') {
      return false;
    }

    task.status = 'paused';
    console.log('⏸️ Task paused:', taskId);
    return true;
  }

  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return false;
    }

    task.status = 'failed';
    task.completedAt = Date.now();
    console.log('❌ Task cancelled:', taskId);
    return true;
  }

  async createTaskGroup(name: string, taskIds: string[], parallelExecution: boolean = false): Promise<string> {
    const groupId = `group-${Date.now()}`;
    
    const group: TaskGroup = {
      id: groupId,
      name,
      tasks: taskIds,
      status: 'pending',
      parallelExecution
    };

    this.taskGroups.set(groupId, group);
    console.log('👥 Task group created:', groupId, 'with', taskIds.length, 'tasks');
    
    return groupId;
  }

  async executeTaskGroup(groupId: string): Promise<boolean> {
    const group = this.taskGroups.get(groupId);
    if (!group) {
      throw new Error(`Task group ${groupId} not found`);
    }

    group.status = 'running';

    if (group.parallelExecution) {
      // Execute all tasks in parallel
      const promises = group.tasks.map(taskId => this.startTask(taskId));
      await Promise.all(promises);
    } else {
      // Execute tasks sequentially
      for (const taskId of group.tasks) {
        await this.startTask(taskId);
        // Wait for task completion
        await this.waitForTaskCompletion(taskId);
      }
    }

    group.status = 'completed';
    console.log('🎯 Task group completed:', groupId);
    return true;
  }

  private async waitForTaskCompletion(taskId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const task = this.tasks.get(taskId);
        if (task && (task.status === 'completed' || task.status === 'failed')) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  getTasks(filters?: {
    status?: Task['status'];
    type?: Task['type'];
    priority?: Task['priority'];
  }): Task[] {
    let tasks = Array.from(this.tasks.values());

    if (filters) {
      if (filters.status) {
        tasks = tasks.filter(t => t.status === filters.status);
      }
      if (filters.type) {
        tasks = tasks.filter(t => t.type === filters.type);
      }
      if (filters.priority) {
        tasks = tasks.filter(t => t.priority === filters.priority);
      }
    }

    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  }

  getTaskById(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getTaskGroups(): TaskGroup[] {
    return Array.from(this.taskGroups.values());
  }

  getSystemStats(): {
    totalTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgCompletionTime: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0) / completedTasks.length 
      : 0;

    return {
      totalTasks: tasks.length,
      runningTasks: tasks.filter(t => t.status === 'running').length,
      completedTasks: completedTasks.length,
      failedTasks: tasks.filter(t => t.status === 'failed').length,
      avgCompletionTime
    };
  }
}

export default UTTService;
