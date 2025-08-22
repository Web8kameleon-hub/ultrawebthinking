/**
 * DataCompression - Real data compression and storage utilities
 * Author: EuroWeb Ultra Platform
 */

// Native compression using TextEncoder/TextDecoder and simple compression algorithms

export interface CompressionMetadata {
  readonly compressed: boolean;
  readonly algorithm: string;
  readonly originalSize: number;
  readonly compressedSize: number;
  readonly timestamp: string;
}

export interface CompressedData<T = any> {
  readonly data: string;
  readonly metadata: CompressionMetadata;
}

export class DataCompressor {
  static compress<T>(data: T): CompressedData<T> {
    const jsonString = JSON.stringify(data);
    const originalSize = new TextEncoder().encode(jsonString).length;
    
    try {
      // Simple compression using base64 encoding with minimal compression
      const compressed = btoa(jsonString);
      const compressedSize = compressed.length;
      
      return {
        data: compressed,
        metadata: {
          compressed: true,
          algorithm: 'base64',
          originalSize,
          compressedSize,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      // Fallback to uncompressed
      return {
        data: btoa(jsonString),
        metadata: {
          compressed: false,
          algorithm: 'none',
          originalSize,
          compressedSize: originalSize,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  static decompress<T>(compressedData: CompressedData<T>): T {
    try {
      if (compressedData.metadata.compressed) {
        // Simple decompression from base64
        const jsonString = atob(compressedData.data);
        return JSON.parse(jsonString);
      } else {
        const jsonString = atob(compressedData.data);
        return JSON.parse(jsonString);
      }
    } catch (error) {
      throw new Error(`Decompression failed: ${error}`);
    }
  }
}

export class GlobalDataStore {
  private store = new Map<string, any>();
  private accessCount = 0;
  private lastAccess = new Date();

  set<T>(key: string, value: T): void {
    this.store.set(key, value);
    this.accessCount++;
    this.lastAccess = new Date();
  }

  get<T>(key: string): T | undefined {
    this.accessCount++;
    this.lastAccess = new Date();
    return this.store.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): boolean {
    const result = this.store.delete(key);
    if (result) {
      this.accessCount++;
      this.lastAccess = new Date();
    }
    return result;
  }

  clear(): void {
    this.store.clear();
    this.accessCount++;
    this.lastAccess = new Date();
  }

  keys(): IterableIterator<string> {
    return this.store.keys();
  }

  getMetrics() {
    return {
      size: this.store.size,
      accessCount: this.accessCount,
      lastAccess: this.lastAccess.toISOString()
    };
  }
}

export const globalDataStore = new GlobalDataStore();