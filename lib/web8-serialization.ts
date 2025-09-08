import CBOR from 'cbor-js'

export interface SerializationOptions {
  format: 'json' | 'cbor'
  compress?: boolean
  validateSchema?: boolean
}

export interface SerializedData {
  data: ArrayBuffer | string
  format: 'json' | 'cbor'
  size: number
  compressed: boolean
}

/**
 * Web8 Data Serialization Service
 * Menaxhon JSON dhe CBOR në harmoni për optimizim të performancës
 */
export class Web8DataSerializer {
  /**
   * Serialize data në format të specifikuar
   */
  static serialize(data: any, options: SerializationOptions = { format: 'json' }): SerializedData {
    try {
      let serialized: ArrayBuffer | string
      let size: number

      if (options.format === 'cbor') {
        // CBOR - Binary format për efikasitet maksimal
        const encoded = CBOR.encode(data)
        serialized = encoded
        size = encoded.byteLength
      } else {
        // JSON - Text format për lexueshmëri
        const jsonString = JSON.stringify(data)
        serialized = jsonString
        size = new TextEncoder().encode(jsonString).length
      }

      return {
        data: serialized,
        format: options.format,
        size,
        compressed: options.compress || false
      }
    } catch (error) {
      throw new Error(`Serialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Deserialize data nga format i specifikuar
   */
  static deserialize(serializedData: SerializedData): any {
    try {
      if (serializedData.format === 'cbor') {
        return CBOR.decode(serializedData.data as ArrayBuffer)
      } else {
        return JSON.parse(serializedData.data as string)
      }
    } catch (error) {
      throw new Error(`Deserialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Krahasim efikasiteti midis JSON dhe CBOR
   */
  static benchmark(data: any): {
    json: { size: number; time: number }
    cbor: { size: number; time: number }
    recommendation: 'json' | 'cbor'
    efficiency_gain: number
  } {
    // Test JSON
    const jsonStart = performance.now()
    const jsonResult = this.serialize(data, { format: 'json' })
    const jsonTime = performance.now() - jsonStart

    // Test CBOR
    const cborStart = performance.now()
    const cborResult = this.serialize(data, { format: 'cbor' })
    const cborTime = performance.now() - cborStart

    const efficiency_gain = ((jsonResult.size - cborResult.size) / jsonResult.size) * 100

    return {
      json: { size: jsonResult.size, time: jsonTime },
      cbor: { size: cborResult.size, time: cborTime },
      recommendation: cborResult.size < jsonResult.size ? 'cbor' : 'json',
      efficiency_gain: Math.abs(efficiency_gain)
    }
  }

  /**
   * Auto-select optimal format based on data characteristics
   */
  static getOptimalFormat(data: any): 'json' | 'cbor' {
    const benchmark = this.benchmark(data)
    
    // Përdor CBOR për të dhëna të mëdha dhe komplekse
    if (benchmark.cbor.size < benchmark.json.size * 0.8) {
      return 'cbor'
    }
    
    // Përdor JSON për të dhëna të vogla dhe debugging
    return 'json'
  }

  /**
   * Smart API Response Handler
   * Zgjedh formatin më të mirë bazuar në madhësinë e të dhënave
   */
  static createAPIResponse(data: any, headers?: Record<string, string>): {
    body: string | ArrayBuffer
    headers: Record<string, string>
    format: 'json' | 'cbor'
  } {
    const optimalFormat = this.getOptimalFormat(data)
    const serialized = this.serialize(data, { format: optimalFormat })

    const responseHeaders = {
      ...headers,
      'Content-Type': optimalFormat === 'cbor' 
        ? 'application/cbor' 
        : 'application/json',
      'X-Data-Format': optimalFormat,
      'X-Data-Size': serialized.size.toString(),
      'Content-Length': serialized.size.toString()
    }

    return {
      body: serialized.data,
      headers: responseHeaders,
      format: optimalFormat
    }
  }
}

/**
 * Web8 API Client - Handle të dyja formatet automatikisht
 */
export class Web8APIClient {
  static async fetch(url: string, options?: RequestInit): Promise<any> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/cbor, application/json',
        ...options?.headers
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('Content-Type') || 'application/json'
    
    if (contentType.includes('application/cbor')) {
      const arrayBuffer = await response.arrayBuffer()
      return CBOR.decode(arrayBuffer)
    } else {
      return await response.json()
    }
  }
}

// Utility Functions
export const serializeForAPI = (data: any) => Web8DataSerializer.createAPIResponse(data)
export const optimizedFetch = (url: string, options?: RequestInit) => Web8APIClient.fetch(url, options)
export const benchmarkData = (data: any) => Web8DataSerializer.benchmark(data)
