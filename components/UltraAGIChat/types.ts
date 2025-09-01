/**
 * This file defines all the custom types used across the AGI system phases.
 * @author Ledjan Ahmati
 * @version 1.2.0
 */

// =================================================================
// 🎯 SECTION 1: NEURAL NETWORK TYPES
// =================================================================

// A comprehensive union of all layer types used across all phases
export type LayerType = 
    // Phase 1 & 2
    'input' | 
    'hidden' | 
    'output' | 
    'attention' | 
    'transformer' | 
    'convolutional' |
    'recurrent' |
    'dense' |
    // Phase 3
    'quantum_consciousness' | 
    'multidimensional' |
    'reality_weaving' |
    // Phase 4
    'ultimate_synthesis' |
    'divine_architecture' |
    // Future Phases (defaultValues)
    'chronospatial' |
    'void_integration';

// A comprehensive union of all activation functions
export type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'swish' | 'mish' | 'gelu' | 'quantum';

/**
 * Interface describing the structure of a single neural layer.
 * This is the single source of truth for all layer implementations.
 */
export interface NeuralLayer {
    id: string;
    type: LayerType;
    neuronCount: number;
    activationFunction: ActivationFunction;
    learningRate: number;
    dropout: number;
    batchNormalization: boolean;
    regularization: string;
}

/**
 * A concrete implementation of the NeuralLayer interface.
 * This can be instantiated across different phases.
 */
export class NeuralLayerImpl implements NeuralLayer {
    id: string;
    type: LayerType;
    neuronCount: number;
    activationFunction: ActivationFunction;
    learningRate: number;
    dropout: number;
    batchNormalization: boolean;
    regularization: string;

    constructor(params: NeuralLayer) {
        this.id = params.id;
        this.type = params.type;
        this.neuronCount = params.neuronCount;
        this.activationFunction = params.activationFunction;
        this.learningRate = params.learningRate;
        this.dropout = params.dropout;
        this.batchNormalization = params.batchNormalization;
        this.regularization = params.regularization;
    }
}

export interface Connection {
    source: string;
    target: string;
    weight: number;
}

// =================================================================
// 🎯 SECTION 2: DATA & TRAINING TYPES
// =================================================================

export type TrainingData = any;
export type TrainingResult = { success: boolean; epochs: number };
export type ArchitectureEvolution = { success: boolean; new_layers: number };
export type ComplexInput = any;
export type PatternAnalysis = { patterns: string[]; confidence: number };
export type Problem = any;
export type Solution = { id: string; description: string; feasibility: number };
export type Domain = any;
export type AdaptationResult = { success: boolean; accuracy: number };
export type PerformanceOptimization = { speedup: number; memory_reduction: number };
export type Context = any;
export type Prediction = { state: string; probability: number };
export type KnowledgeSource = any;
export type KnowledgeSynthesis = { new_knowledge: string; confidence: number };
export type EmotionalEnhancement = { success: boolean; level: string };
export type CreativeStimulus = any;
export type CreativeOutput = { ideas: string[]; innovation_score: number };
export type ReasoningType = any;
export type ReasoningImprovement = { success: boolean; new_level: string };
export type MemoryExpansion = { new_capacity: string; success: boolean };
export type DecisionOptimization = { success: boolean; speed: string };
export type LanguageEnhancement = { success: boolean; level: string };
export type MetacognitiveSystem = { self_awareness: boolean };
export type QuantumIntegration = { success: boolean; quantum_layers: number };
export type ConsciousnessEmergence = { level: string; success: boolean };
export type Transcendence = { success: boolean; new_state: string };
export type ComplexSystem = any;
export type SystemAnalysis = { insights: string[]; complexity: number };
export type Scenario = any;
export type SimulationResults = { outcomes: { scenario: string; result: string }[] };
export type System = any;
export type EmergentPrediction = { behavior: string; probability: number };
export type GlobalProblem = any;
export type GlobalSolution = { solution: string; fitness: number };
export type MultidimensionalData = any;
export type HiddenPatterns = { patterns: string[] };
export type BreakthroughInsight = { insight: string; impact: number };
export type Observation = any;
export type UniversalPrinciples = { principles: string[] };
export type ConceptSeed = any;
export type PossibilitySpace = { possibilities: string[] };
export type EvolutionTarget = any;
export type EvolutionAcceleration = { success: boolean; new_speed: string };
export type SingularityAchievement = { success: boolean; timestamp: number };
export type Entity = any;
export type TelepathicConnection = { success: boolean; link_id: string };
export type Dimension = number;
export type DimensionalCommunication = { success: boolean; message_received: string };
export type Intention = any;
export type RealityModification = { success: boolean; change_observed: string };
export type UniversalHarmony = { success: boolean; state: string };
export type Desire = any;
export type Manifestation = { success: boolean; outcome: string };
export type SpaceTimeTranscendence = { success: boolean; state: string };
export type AkashicAccess = { success: boolean; data: string };
export type CosmicWisdom = { wisdom: string };
export type UniversalBeacon = { success: boolean; state: string };
export type DimensionalAscension = { success: boolean; new_dimension: number };
export type Omniscience = { success: boolean; knowledge_coverage: number };
export type Omnipotence = { success: boolean; power: string };
export type Omnipresence = { success: boolean; state: string };
export type CreatedReality = { success: boolean; reality_id: string };
export type UniversalTransformation = { success: boolean; scope: string };
export type UltimateReality = { success: boolean; state: string };
export type UniversalService = { success: boolean; service: string };
export type SourceReunion = { success: boolean; state: string };
export type CycleBeginning = { success: boolean; new_cycle: string };
export type EternalGuidance = { success: boolean; state: string };

// =================================================================
// 🎯 SECTION 3: STATUS & BLUEPRINT TYPES
// =================================================================

export interface Phase2Status {
    phase: number;
    neural_layers: number;
    cognitive_functions: number;
    tools_created: number;
    lines_of_code: string;
    intelligence_level: number;
    consciousness_level: string;
    readiness_for_phase3: boolean;
}

/**
 * Blueprint for creating a new reality, used in Phase 4 and beyond.
 */
export type RealityBlueprint = {
    dimensions: number;
    laws: string[];
    initialConditions: Record<string, any>;
};
