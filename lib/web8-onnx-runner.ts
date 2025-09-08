/**
 * Web8 ONNX Runtime Manager
 * Ultra-efficient ONNX model inference për Web8 platform
 */

import * as ort from 'onnxruntime-web'

export interface OnnxModelConfig {
  modelPath: string
  inputNames: string[]
  outputNames: string[]
  inputShapes: number[][]
  executionProviders: ('webgl' | 'cpu' | 'wasm')[]
}

export interface OnnxInferenceResult {
  outputs: Record<string, ort.Tensor>
  inferenceTime: number
  memoryUsage: number
}

/**
 * Web8 ONNX Session Manager
 */
export class Web8OnnxRunner {
  private static instance: Web8OnnxRunner
  private sessions: Map<string, ort.InferenceSession> = new Map()
  private modelConfigs: Map<string, OnnxModelConfig> = new Map()

  private constructor() {
    // Configure ONNX Runtime për Web8
    ort.env.wasm.wasmPaths = '/models/wasm/'
    ort.env.wasm.numThreads = 1
    ort.env.logLevel = 'error'
  }

  static getInstance(): Web8OnnxRunner {
    if (!Web8OnnxRunner.instance) {
      Web8OnnxRunner.instance = new Web8OnnxRunner()
    }
    return Web8OnnxRunner.instance
  }

  /**
   * Load një model ONNX
   */
  async loadModel(modelId: string, config: OnnxModelConfig): Promise<void> {
    try {
      const sessionOptions: ort.InferenceSession.SessionOptions = {
        executionProviders: config.executionProviders,
        logSeverityLevel: 3, // Error only
        enableCpuMemArena: false,
        enableMemPattern: false
      }

      const session = await ort.InferenceSession.create(
        config.modelPath,
        sessionOptions
      )

      this.sessions.set(modelId, session)
      this.modelConfigs.set(modelId, config)

      console.log(`✅ ONNX Model loaded: ${modelId}`)
    } catch (error) {
      console.error(`❌ Failed to load ONNX model ${modelId}:`, error)
      throw error
    }
  }

  /**
   * Run inference në një model
   */
  async runInference(
    modelId: string,
    inputs: Record<string, ort.Tensor>
  ): Promise<OnnxInferenceResult> {
    const session = this.sessions.get(modelId)
    if (!session) {
      throw new Error(`Model ${modelId} not loaded`)
    }

    const startTime = performance.now()
    const startMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0

    try {
      const outputs = await session.run(inputs)
      
      const endTime = performance.now()
      const endMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0

      return {
        outputs,
        inferenceTime: endTime - startTime,
        memoryUsage: endMemory - startMemory
      }
    } catch (error) {
      console.error(`Inference failed for model ${modelId}:`, error)
      throw error
    }
  }

  /**
   * Create tensor nga data
   */
  createTensor(
    data: Float32Array | Int32Array | number[],
    shape: number[],
    type: 'float32' | 'int32' = 'float32'
  ): ort.Tensor {
    return new ort.Tensor(type, data, shape)
  }

  /**
   * Preprocess image për ONNX model
   */
  async preprocessImage(
    imageData: ImageData,
    targetSize: [number, number] = [224, 224],
    normalize: boolean = true
  ): Promise<ort.Tensor> {
    const [height, width] = targetSize
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = width
    canvas.height = height
    
    // Resize image
    ctx.drawImage(
      new ImageData(imageData.data, imageData.width, imageData.height) as any,
      0, 0, width, height
    )
    
    const resizedImageData = ctx.getImageData(0, 0, width, height)
    
    // Convert to tensor format [1, 3, height, width]
    const tensorData = new Float32Array(3 * height * width)
    
    for (let i = 0; i < height * width; i++) {
      const pixelIndex = i * 4
      
      // RGB channels (skip alpha)
      tensorData[i] = resizedImageData.data[pixelIndex] / (normalize ? 255.0 : 1.0)     // R
      tensorData[height * width + i] = resizedImageData.data[pixelIndex + 1] / (normalize ? 255.0 : 1.0) // G
      tensorData[2 * height * width + i] = resizedImageData.data[pixelIndex + 2] / (normalize ? 255.0 : 1.0) // B
    }
    
    return this.createTensor(tensorData, [1, 3, height, width])
  }

  /**
   * Batch inference për multiple inputs
   */
  async runBatchInference(
    modelId: string,
    batchInputs: Record<string, ort.Tensor>[]
  ): Promise<OnnxInferenceResult[]> {
    const results: OnnxInferenceResult[] = []
    
    for (const inputs of batchInputs) {
      const result = await this.runInference(modelId, inputs)
      results.push(result)
    }
    
    return results
  }

  /**
   * Get model info
   */
  getModelInfo(modelId: string): {
    config: OnnxModelConfig | undefined
    loaded: boolean
    inputNames: readonly string[]
    outputNames: readonly string[]
  } {
    const session = this.sessions.get(modelId)
    const config = this.modelConfigs.get(modelId)
    
    return {
      config,
      loaded: !!session,
      inputNames: session?.inputNames || [],
      outputNames: session?.outputNames || []
    }
  }

  /**
   * Unload model për të liruar memory
   */
  async unloadModel(modelId: string): Promise<void> {
    const session = this.sessions.get(modelId)
    if (session) {
      await session.release()
      this.sessions.delete(modelId)
      this.modelConfigs.delete(modelId)
      console.log(`🗑️  ONNX Model unloaded: ${modelId}`)
    }
  }

  /**
   * Get performance stats
   */
  getStats(): {
    loadedModels: number
    totalMemoryMB: number
    models: string[]
  } {
    return {
      loadedModels: this.sessions.size,
      totalMemoryMB: this.sessions.size * 50, // Rough estimation
      models: Array.from(this.sessions.keys())
    }
  }

  /**
   * Cleanup all models
   */
  async cleanup(): Promise<void> {
    for (const [modelId] of this.sessions) {
      await this.unloadModel(modelId)
    }
  }
}

/**
 * Predefined model configurations për Web8
 */
export const Web8ModelConfigs: Record<string, OnnxModelConfig> = {
  mobilenetv2: {
    modelPath: '/models/mobilenetv2.onnx',
    inputNames: ['input'],
    outputNames: ['output'],
    inputShapes: [[1, 3, 224, 224]],
    executionProviders: ['webgl', 'cpu']
  },
  
  textClassifier: {
    modelPath: '/models/text-classifier.onnx',
    inputNames: ['input_ids', 'attention_mask'],
    outputNames: ['logits'],
    inputShapes: [[1, 512], [1, 512]],
    executionProviders: ['cpu']
  },
  
  embedding: {
    modelPath: '/models/sentence-transformer.onnx',
    inputNames: ['input_ids', 'attention_mask'],
    outputNames: ['embeddings'],
    inputShapes: [[1, 256], [1, 256]],
    executionProviders: ['cpu']
  }
}

/**
 * Easy-to-use utility functions
 */
export const onnxRunner = Web8OnnxRunner.getInstance()

export async function loadWeb8Model(modelId: keyof typeof Web8ModelConfigs): Promise<void> {
  const config = Web8ModelConfigs[modelId]
  if (!config) {
    throw new Error(`Unknown model: ${modelId}`)
  }
  
  await onnxRunner.loadModel(modelId, config)
}

export async function classifyImageWithOnnx(
  imageData: ImageData,
  modelId: string = 'mobilenetv2'
): Promise<number[]> {
  const imageTensor = await onnxRunner.preprocessImage(imageData)
  const result = await onnxRunner.runInference(modelId, { input: imageTensor })
  
  const outputTensor = result.outputs.output
  return Array.from(outputTensor.data as Float32Array)
}

export async function getTextEmbeddingWithOnnx(
  inputIds: number[],
  attentionMask: number[],
  modelId: string = 'embedding'
): Promise<number[]> {
  const inputIdsTensor = onnxRunner.createTensor(new Int32Array(inputIds), [1, inputIds.length], 'int32')
  const attentionTensor = onnxRunner.createTensor(new Int32Array(attentionMask), [1, attentionMask.length], 'int32')
  
  const result = await onnxRunner.runInference(modelId, {
    input_ids: inputIdsTensor,
    attention_mask: attentionTensor
  })
  
  const embeddingTensor = result.outputs.embeddings
  return Array.from(embeddingTensor.data as Float32Array)
}
