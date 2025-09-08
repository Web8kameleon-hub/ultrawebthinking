// Real validator for Web8 memory and responses
// No mocks - validates against real memory and real data
import { agiCore, AGIMemoryStore } from './AGICore';
import { realSense, RealInputPayload } from './sense';

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  realData: {
    memoryConsistency: boolean;
    networkIntegrity: boolean;
    agiCoherence: boolean;
    userExperience: boolean;
  };
}

export interface ValidationRules {
  memoryThresholds: {
    maxSize: number;
    maxAge: number;
    minCoherence: number;
  };
  networkRequirements: {
    maxLatency: number;
    minPeers: number;
    requiredBandwidth: number;
  };
  agiStandards: {
    minConfidence: number;
    maxResponseTime: number;
    requiredReasoningDepth: number;
  };
}

class RealValidator {
  private rules: ValidationRules;
  private validationHistory: ValidationResult[] = [];

  constructor() {
    this.rules = {
      memoryThresholds: {
        maxSize: 100 * 1024 * 1024, // 100MB
        maxAge: 86400000, // 24 hours
        minCoherence: 0.8,
      },
      networkRequirements: {
        maxLatency: 1000, // 1 second
        minPeers: 3,
        requiredBandwidth: 1024, // 1KB/s
      },
      agiStandards: {
        minConfidence: 0.7,
        maxResponseTime: 5000, // 5 seconds
        requiredReasoningDepth: 3,
      },
    };
  }

  // Validate real memory against real usage patterns
  validateMemory(memory: AGIMemoryStore): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 1.0;

    // Check memory consistency
    const memoryConsistency = this.checkMemoryConsistency(memory);
    if (!memoryConsistency.isValid) {
      errors.push(...memoryConsistency.errors);
      score -= 0.3;
    }

    // Check memory size and age
    const memoryHealth = this.checkMemoryHealth(memory);
    if (!memoryHealth.isValid) {
      warnings.push(...memoryHealth.warnings);
      score -= 0.1;
    }

    // Check coherence across different memory segments
    const coherenceScore = this.calculateMemoryCoherence(memory);
    if (coherenceScore < this.rules.memoryThresholds.minCoherence) {
      errors.push(`Memory coherence too low: ${coherenceScore}`);
      score -= 0.2;
    }

    return {
      isValid: errors.length === 0,
      score: Math.max(0, score),
      errors,
      warnings,
      suggestions,
      realData: {
        memoryConsistency: memoryConsistency.isValid,
        networkIntegrity: true, // Will be set by network validation
        agiCoherence: coherenceScore >= this.rules.memoryThresholds.minCoherence,
        userExperience: true, // Will be set by UX validation
      },
    };
  }

  // Validate real network mesh operations
  validateNetworkMesh(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 1.0;

    // Capture real network data
    const networkData = realSense.captureNetworkMesh();
    
    // Validate peer connections
    const peers = networkData.data.connectedPeers || [];
    if (peers.length < this.rules.networkRequirements.minPeers) {
      errors.push(`Insufficient peers: ${peers.length} < ${this.rules.networkRequirements.minPeers}`);
      score -= 0.4;
    }

    // Validate network latency
    const latency = networkData.context.networkLatency;
    if (latency > this.rules.networkRequirements.maxLatency) {
      warnings.push(`High network latency: ${latency}ms`);
      score -= 0.1;
    }

    // Validate bandwidth
    const bandwidth = networkData.data.bandwidthUsage;
    if (bandwidth && bandwidth.download < this.rules.networkRequirements.requiredBandwidth) {
      warnings.push(`Low bandwidth: ${bandwidth.download} bytes/s`);
      score -= 0.1;
    }

    return {
      isValid: errors.length === 0,
      score: Math.max(0, score),
      errors,
      warnings,
      suggestions,
      realData: {
        memoryConsistency: true,
        networkIntegrity: errors.length === 0 && warnings.length < 2,
        agiCoherence: true,
        userExperience: latency < this.rules.networkRequirements.maxLatency / 2,
      },
    };
  }

  // Validate real AGI responses and reasoning
  validateAGIResponse(input: string, response: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 1.0;

    // Capture real AGI processing data
    const agiData = realSense.captureAGIProcessing(input);
    
    // Validate confidence score
    const confidence = agiData.data.confidenceScore;
    if (confidence < this.rules.agiStandards.minConfidence) {
      errors.push(`Low confidence: ${confidence}`);
      score -= 0.3;
    }

    // Validate reasoning depth
    const reasoningSteps = agiData.data.processingSteps.length;
    if (reasoningSteps < this.rules.agiStandards.requiredReasoningDepth) {
      warnings.push(`Shallow reasoning: ${reasoningSteps} steps`);
      score -= 0.1;
    }

    // Validate neural activity
    const neuralActivity = agiData.data.neuralActivity;
    const activityRatio = neuralActivity.active / neuralActivity.total;
    if (activityRatio < 0.1) {
      warnings.push(`Low neural activity: ${activityRatio * 100}%`);
      score -= 0.1;
    }

    // Validate response coherence with memory
    const memory = agiCore.getMemory();
    const responseCoherence = this.validateResponseCoherence(response, memory);
    if (!responseCoherence) {
      errors.push('Response inconsistent with memory');
      score -= 0.2;
    }

    return {
      isValid: errors.length === 0,
      score: Math.max(0, score),
      errors,
      warnings,
      suggestions,
      realData: {
        memoryConsistency: responseCoherence,
        networkIntegrity: true,
        agiCoherence: confidence >= this.rules.agiStandards.minConfidence,
        userExperience: reasoningSteps >= this.rules.agiStandards.requiredReasoningDepth,
      },
    };
  }

  // Validate real user experience
  validateUserExperience(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 1.0;

    // Capture real user interaction data
    const userInput = realSense.captureRealInput();
    const senseData = realSense.senseEnvironment();

    // Validate performance
    const memoryUsage = userInput.context.memoryUsage;
    if (memoryUsage > this.rules.memoryThresholds.maxSize) {
      warnings.push(`High memory usage: ${memoryUsage} bytes`);
      score -= 0.1;
    }

    // Validate responsiveness
    const networkLatency = userInput.context.networkLatency;
    if (networkLatency > this.rules.networkRequirements.maxLatency) {
      errors.push(`Poor responsiveness: ${networkLatency}ms latency`);
      score -= 0.2;
    }

    // Validate interaction quality
    const interactions = senseData.interaction;
    const totalInteractions = interactions.clicks + interactions.scrolls + interactions.keystrokes;
    if (totalInteractions === 0) {
      warnings.push('No user interactions detected');
      score -= 0.1;
    }

    // Validate environment compatibility
    const environment = senseData.environment;
    if (environment.battery < 0.2) {
      warnings.push('Low battery may affect performance');
      score -= 0.05;
    }

    if (environment.connection === 'offline') {
      errors.push('Offline mode - limited functionality');
      score -= 0.5;
    }

    return {
      isValid: errors.length === 0,
      score: Math.max(0, score),
      errors,
      warnings,
      suggestions,
      realData: {
        memoryConsistency: memoryUsage < this.rules.memoryThresholds.maxSize,
        networkIntegrity: environment.connection !== 'offline',
        agiCoherence: true,
        userExperience: networkLatency < this.rules.networkRequirements.maxLatency && totalInteractions > 0,
      },
    };
  }

  // Comprehensive validation combining all aspects
  validateSystem(): ValidationResult {
    const memory = agiCore.getMemory();
    const memoryResult = this.validateMemory(memory);
    const networkResult = this.validateNetworkMesh();
    const uxResult = this.validateUserExperience();

    const allErrors = [...memoryResult.errors, ...networkResult.errors, ...uxResult.errors];
    const allWarnings = [...memoryResult.warnings, ...networkResult.warnings, ...uxResult.warnings];
    const averageScore = (memoryResult.score + networkResult.score + uxResult.score) / 3;

    const result: ValidationResult = {
      isValid: allErrors.length === 0,
      score: averageScore,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: ['Consider optimizing memory usage', 'Monitor network health', 'Enhance AGI reasoning'],
      realData: {
        memoryConsistency: memoryResult.realData.memoryConsistency,
        networkIntegrity: networkResult.realData.networkIntegrity,
        agiCoherence: memoryResult.realData.agiCoherence,
        userExperience: uxResult.realData.userExperience,
      },
    };

    this.validationHistory.push(result);
    return result;
  }

  private checkMemoryConsistency(memory: AGIMemoryStore): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if timestamps are consistent
    const currentTime = Date.now();
    const userTime = new Date(memory.user.currentTime).getTime();
    if (Math.abs(currentTime - userTime) > 10000) { // 10 seconds tolerance
      errors.push('Memory timestamp inconsistent with current time');
    }

    // Check if UI state is coherent
    if (!memory.ui.activeTab || !memory.ui.theme) {
      errors.push('Missing essential UI state');
    }

    // Check if AGI state is coherent
    if (memory.agi.responses.length > 0 && !memory.agi.lastQuery) {
      errors.push('AGI responses exist without query');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private checkMemoryHealth(memory: AGIMemoryStore): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Check memory age
    const memoryAge = Date.now() - new Date(memory.user.currentTime).getTime();
    if (memoryAge > this.rules.memoryThresholds.maxAge) {
      warnings.push('Memory data is stale');
    }

    // Check memory size (approximation)
    const memoryString = JSON.stringify(memory);
    if (memoryString.length > this.rules.memoryThresholds.maxSize / 1000) {
      warnings.push('Memory approaching size limit');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }

  private calculateMemoryCoherence(memory: AGIMemoryStore): number {
    let coherenceScore = 1.0;

    // Check consistency between different memory sections
    if (memory.ui.activeTab !== 'agi-dashboard' && memory.agi.status === 'ACTIVE') {
      coherenceScore -= 0.1;
    }

    if (memory.agi.responses.length === 0 && memory.agi.status === 'PROCESSING') {
      coherenceScore -= 0.2;
    }

    if (memory.user.history.length > 0 && !memory.user.preferences) {
      coherenceScore -= 0.1;
    }

    return Math.max(0, coherenceScore);
  }

  private validateResponseCoherence(response: any, memory: AGIMemoryStore): boolean {
    // Check if response aligns with current memory state
    if (!response || typeof response !== 'object') {return false;}
    
    // Check if response references known context
    const responseText = JSON.stringify(response);
    const hasContext = memory.agi.lastQuery && responseText.includes(memory.agi.lastQuery);
    
    return hasContext || memory.agi.responses.length === 0;
  }

  getValidationHistory(): ValidationResult[] {
    return [...this.validationHistory];
  }

  getSystemHealth(): { overall: number; components: Record<string, number> } {
    const recent = this.validationHistory.slice(-10);
    if (recent.length === 0) {return { overall: 0, components: {} };}

    const overall = recent.reduce((sum, r) => sum + r.score, 0) / recent.length;
    
    const components = {
      memory: recent.reduce((sum, r) => sum + (r.realData.memoryConsistency ? 1 : 0), 0) / recent.length,
      network: recent.reduce((sum, r) => sum + (r.realData.networkIntegrity ? 1 : 0), 0) / recent.length,
      agi: recent.reduce((sum, r) => sum + (r.realData.agiCoherence ? 1 : 0), 0) / recent.length,
      ux: recent.reduce((sum, r) => sum + (r.realData.userExperience ? 1 : 0), 0) / recent.length,
    };

    return { overall, components };
  }
}

export const realValidator = new RealValidator();
export { RealValidator }
