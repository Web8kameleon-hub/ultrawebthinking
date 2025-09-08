/**
 * Web8 AI Configuration
 * Lightweight, modular, ultra-efficient AI stack pa TensorFlow
 */

import { pipeline } from '@xenova/transformers'
import type { InferenceSession } from 'onnxruntime-web'

export interface Web8AIConfig {
  models: {
    sentiment: string
    textGeneration: string
    imageClassification: string
    embedding: string
  }
  performance: {
    maxMemoryUsage: number
    preferredDevice: 'cpu' | 'gpu' | 'webgl'
    batchSize: number
  }
  cache: {
    modelCache: boolean
    resultCache: boolean
    cacheTTL: number
  }
}

export const defaultAIConfig: Web8AIConfig = {
  models: {
    sentiment: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    textGeneration: 'Xenova/gpt2',
    imageClassification: 'Xenova/vit-base-patch16-224',
    embedding: 'Xenova/all-MiniLM-L6-v2'
  },
  performance: {
    maxMemoryUsage: 512, // MB
    preferredDevice: 'cpu',
    batchSize: 8
  },
  cache: {
    modelCache: true,
    resultCache: true,
    cacheTTL: 3600000 // 1 hour
  }
}

/**
 * Web8 AI Pipeline Manager
 * Menaxhon të gjitha AI tasks në mënyrë modulare
 */
export class Web8AIManager {
  private static instance: Web8AIManager
  private models: Map<string, any> = new Map()
  private config: Web8AIConfig

  private constructor(config: Web8AIConfig = defaultAIConfig) {
    this.config = config
  }

  static getInstance(config?: Web8AIConfig): Web8AIManager {
    if (!Web8AIManager.instance) {
      Web8AIManager.instance = new Web8AIManager(config)
    }
    return Web8AIManager.instance
  }

  /**
   * Initialize AI pipeline për një task të caktuar
   */
  async loadModel(task: keyof Web8AIConfig['models'], modelName?: string): Promise<any> {
    const modelKey = modelName || this.config.models[task]
    
    if (this.models.has(modelKey)) {
      return this.models.get(modelKey)
    }

    try {
      let pipelineTask: string
      switch (task) {
        case 'sentiment':
          pipelineTask = 'sentiment-analysis'
          break
        case 'textGeneration':
          pipelineTask = 'text-generation'
          break
        case 'imageClassification':
          pipelineTask = 'image-classification'
          break
        case 'embedding':
          pipelineTask = 'feature-extraction'
          break
        default:
          throw new Error(`Unknown task: ${task}`)
      }

      const model = await pipeline(pipelineTask as any, modelKey)
      
      if (this.config.cache.modelCache) {
        this.models.set(modelKey, model)
      }
      
      return model
    } catch (error) {
      console.error(`Failed to load model for task ${task}:`, error)
      throw error
    }
  }

  /**
   * Sentiment Analysis
   */
  async analyzeSentiment(text: string): Promise<{
    label: string
    score: number
    confidence: 'high' | 'medium' | 'low'
  }> {
    const model = await this.loadModel('sentiment')
    const result = await model(text)
    
    return {
      label: result[0].label,
      score: result[0].score,
      confidence: result[0].score > 0.8 ? 'high' : result[0].score > 0.6 ? 'medium' : 'low'
    }
  }

  /**
   * Text Generation
   */
  async generateText(prompt: string, maxLength: number = 50): Promise<string> {
    const model = await this.loadModel('textGeneration')
    const result = await model(prompt, {
      max_length: maxLength,
      num_return_sequences: 1
    })
    
    return result[0].generated_text
  }

  /**
   * Image Classification
   */
  async classifyImage(imageUrl: string): Promise<Array<{
    label: string
    score: number
  }>> {
    const model = await this.loadModel('imageClassification')
    const result = await model(imageUrl)
    
    return result.map((item: any) => ({
      label: item.label,
      score: item.score
    }))
  }

  /**
   * Text Embedding
   */
  async getEmbedding(text: string): Promise<number[]> {
    const model = await this.loadModel('embedding')
    const result = await model(text)
    
    return Array.from(result.data)
  }

  /**
   * Batch processing për performance të lartë
   */
  async processBatch<T>(
    items: string[],
    processor: (item: string) => Promise<T>
  ): Promise<T[]> {
    const results: T[] = []
    const batchSize = this.config.performance.batchSize

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      )
      results.push(...batchResults)
    }

    return results
  }

  /**
   * Memory management
   */
  clearCache(): void {
    this.models.clear()
  }

  getMemoryUsage(): {
    modelCount: number
    estimatedMemoryMB: number
  } {
    return {
      modelCount: this.models.size,
      estimatedMemoryMB: this.models.size * 64 // Rough estimation
    }
  }
}

/**
 * Utility functions për easy access
 */
export const aiManager = Web8AIManager.getInstance()

export const analyzeSentiment = (text: string) => aiManager.analyzeSentiment(text)
export const generateText = (prompt: string, maxLength?: number) => aiManager.generateText(prompt, maxLength)
export const classifyImage = (imageUrl: string) => aiManager.classifyImage(imageUrl)
export const getEmbedding = (text: string) => aiManager.getEmbedding(text)

/**
 * Custom AI Modules Integration
 * Integron me sense.ts, mind.ts, planner.ts
 */
export interface Web8AIResponse {
  task: string
  result: any
  confidence: number
  processingTime: number
  memoryUsed: number
}

export async function processWithAI(
  input: string | ArrayBuffer,
  task: 'sentiment' | 'generation' | 'classification' | 'embedding'
): Promise<Web8AIResponse> {
  const startTime = performance.now()
  const startMemory = process.memoryUsage().heapUsed
  
  let result: any
  let confidence = 0

  try {
    switch (task) {
      case 'sentiment':
        const sentimentResult = await analyzeSentiment(input as string)
        result = sentimentResult
        confidence = sentimentResult.score
        break
      case 'generation':
        result = await generateText(input as string)
        confidence = 0.8 // Default për text generation
        break
      case 'classification':
        result = await classifyImage(input as string)
        confidence = result[0]?.score || 0
        break
      case 'embedding':
        result = await getEmbedding(input as string)
        confidence = 1.0 // Embeddings kanë sempre confidence të lartë
        break
      default:
        throw new Error(`Unknown AI task: ${task}`)
    }

    const endTime = performance.now()
    const endMemory = process.memoryUsage().heapUsed

    return {
      task,
      result,
      confidence,
      processingTime: endTime - startTime,
      memoryUsed: endMemory - startMemory
    }
  } catch (error) {
    throw new Error(`AI processing failed for task ${task}: ${error}`)
  }
}
