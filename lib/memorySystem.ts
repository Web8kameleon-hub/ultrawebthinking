/**
 * OpenMind Memory System - Ruajtja dhe menaxhimi i njohurive
 */

export interface MemoryEntry {
  id: string;
  type: 'document' | 'conversation' | 'web_source' | 'knowledge' | 'file';
  title: string;
  content: string;
  metadata: {
    source?: string;
    url?: string;
    timestamp: number;
    tags: string[];
    fileType?: string;
    fileSize?: number;
    language?: string;
    confidence?: number;
    category?: string;
  };
  searchableText: string;
  lastAccessed: number;
  accessCount: number;
}

export interface MemorySearchResult {
  entry: MemoryEntry;
  relevanceScore: number;
  matchedFragments: string[];
}

export class OpenMindMemory {
  private static instance: OpenMindMemory;
  private memories: Map<string, MemoryEntry> = new Map();
  private searchIndex: Map<string, Set<string>> = new Map(); // word -> memory IDs

  static getInstance(): OpenMindMemory {
    if (!OpenMindMemory.instance) {
      OpenMindMemory.instance = new OpenMindMemory();
      OpenMindMemory.instance.loadFromStorage();
    }
    return OpenMindMemory.instance;
  }

  /**
   * Ruan një dokument në memorie
   */
  async storeDocument(file: File | { name: string; content: string; type: string }): Promise<string> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let content = '';
    let fileType = '';
    let fileSize = 0;
    
    if ('size' in file) {
      // Real File object
      content = await this.extractTextFromFile(file);
      fileType = file.type;
      fileSize = file.size;
    } else {
      // Manual content
      content = file.content;
      fileType = file.type;
      fileSize = content.length;
    }

    const entry: MemoryEntry = {
      id,
      type: 'document',
      title: 'name' in file ? file.name : `Document ${Date.now()}`,
      content,
      metadata: {
        timestamp: Date.now(),
        tags: this.extractTags(content),
        fileType,
        fileSize,
        language: this.detectLanguage(content),
        category: 'user_document'
      },
      searchableText: this.createSearchableText(content),
      lastAccessed: Date.now(),
      accessCount: 0
    };

    this.memories.set(id, entry);
    this.updateSearchIndex(id, entry.searchableText);
    this.saveToStorage();
    
    return id;
  }

  /**
   * Ruan një bisedë në memorie
   */
  async storeConversation(query: string, response: string, metadata?: any): Promise<string> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversationText = `Q: ${query}\nA: ${response}`;
    
    const entry: MemoryEntry = {
      id,
      type: 'conversation',
      title: query.length > 50 ? query.substring(0, 50) + '...' : query,
      content: conversationText,
      metadata: {
        timestamp: Date.now(),
        tags: this.extractTags(query + ' ' + response),
        confidence: metadata?.confidence || 0.8,
        category: 'chat_history'
      },
      searchableText: this.createSearchableText(conversationText),
      lastAccessed: Date.now(),
      accessCount: 0
    };

    this.memories.set(id, entry);
    this.updateSearchIndex(id, entry.searchableText);
    this.saveToStorage();
    
    return id;
  }

  /**
   * Ruan një burim nga interneti
   */
  async storeWebSource(url: string, title: string, content: string, metadata?: any): Promise<string> {
    const id = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const entry: MemoryEntry = {
      id,
      type: 'web_source',
      title,
      content,
      metadata: {
        source: 'web',
        url,
        timestamp: Date.now(),
        tags: this.extractTags(content),
        confidence: metadata?.confidence || 0.7,
        category: 'web_knowledge'
      },
      searchableText: this.createSearchableText(title + ' ' + content),
      lastAccessed: Date.now(),
      accessCount: 0
    };

    this.memories.set(id, entry);
    this.updateSearchIndex(id, entry.searchableText);
    this.saveToStorage();
    
    return id;
  }

  /**
   * Kërkon në memorie
   */
  search(query: string, maxResults: number = 10): MemorySearchResult[] {
    const searchTerms = this.extractSearchTerms(query);
    const candidateIds = new Set<string>();
    
    // Gjej të gjitha memorjet që përmbajnë termat e kërkuara
    searchTerms.forEach(term => {
      const ids = this.searchIndex.get(term.toLowerCase());
      if (ids) {
        ids.forEach(id => candidateIds.add(id));
      }
    });

    const results: MemorySearchResult[] = [];
    
    candidateIds.forEach(id => {
      const memory = this.memories.get(id);
      if (memory) {
        const relevanceScore = this.calculateRelevance(query, memory);
        if (relevanceScore > 0.1) { // Minimum relevance threshold
          const matchedFragments = this.findMatchedFragments(query, memory.content);
          results.push({
            entry: memory,
            relevanceScore,
            matchedFragments
          });
          
          // Update access stats
          memory.lastAccessed = Date.now();
          memory.accessCount++;
        }
      }
    });

    // Sort by relevance and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Merr memorje të relacionuara me një temë
   */
  getRelatedMemories(topic: string, limit: number = 5): MemoryEntry[] {
    const searchResults = this.search(topic, limit);
    return searchResults.map(result => result.entry);
  }

  /**
   * Merr statistikat e memories
   */
  getMemoryStats(): {
    totalMemories: number;
    byType: Record<string, number>;
    totalSize: number;
    mostAccessed: MemoryEntry[];
    recent: MemoryEntry[];
  } {
    const byType: Record<string, number> = {};
    let totalSize = 0;
    
    this.memories.forEach(memory => {
      byType[memory.type] = (byType[memory.type] || 0) + 1;
      totalSize += memory.content.length;
    });

    const sortedByAccess = Array.from(this.memories.values())
      .sort((a, b) => b.accessCount - a.accessCount);
    
    const sortedByTime = Array.from(this.memories.values())
      .sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

    return {
      totalMemories: this.memories.size,
      byType,
      totalSize,
      mostAccessed: sortedByAccess.slice(0, 5),
      recent: sortedByTime.slice(0, 5)
    };
  }

  /**
   * Ekstraktion i tekstit nga fajllat
   */
  private async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text || '');
      };
      reader.readAsText(file);
    });
  }

  /**
   * Krijon tekst të kërkueshëm
   */
  private createSearchableText(content: string): string {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Ekstrakton tag-e nga përmbajtja
   */
  private extractTags(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = new Set(['është', 'për', 'në', 'me', 'të', 'dhe', 'që', 'një', 'si', 'nga', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    const tags = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 10); // Limit to 10 tags
    
    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Detekton gjuhën e tekstit
   */
  private detectLanguage(content: string): string {
    const albanianWords = ['është', 'për', 'në', 'me', 'të', 'dhe', 'që', 'një', 'si', 'nga'];
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of'];
    
    const words = content.toLowerCase().split(/\s+/);
    let albanianCount = 0;
    let englishCount = 0;
    
    words.forEach(word => {
      if (albanianWords.includes(word)) albanianCount++;
      if (englishWords.includes(word)) englishCount++;
    });
    
    return albanianCount > englishCount ? 'sq' : 'en';
  }

  /**
   * Përditëson indeksin e kërkimit
   */
  private updateSearchIndex(memoryId: string, searchableText: string): void {
    const words = searchableText.split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(memoryId);
      }
    });
  }

  /**
   * Ekstrakton termat e kërkimit
   */
  private extractSearchTerms(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2);
  }

  /**
   * Kalkulon relevancën
   */
  private calculateRelevance(query: string, memory: MemoryEntry): number {
    const queryTerms = this.extractSearchTerms(query);
    const memoryText = memory.searchableText;
    
    let score = 0;
    let totalTerms = queryTerms.length;
    
    queryTerms.forEach(term => {
      if (memoryText.includes(term)) {
        score += 1;
        // Bonus for title matches
        if (memory.title.toLowerCase().includes(term)) {
          score += 0.5;
        }
      }
    });
    
    return totalTerms > 0 ? score / totalTerms : 0;
  }

  /**
   * Gjen fragmentet që përputhen
   */
  private findMatchedFragments(query: string, content: string): string[] {
    const queryTerms = this.extractSearchTerms(query);
    const sentences = content.split(/[.!?]+/);
    const fragments: string[] = [];
    
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      let matchCount = 0;
      
      queryTerms.forEach(term => {
        if (sentenceLower.includes(term)) {
          matchCount++;
        }
      });
      
      if (matchCount > 0 && sentence.trim().length > 20) {
        fragments.push(sentence.trim().substring(0, 200));
      }
    });
    
    return fragments.slice(0, 3); // Return top 3 fragments
  }

  /**
   * Ruan në localStorage
   */
  private saveToStorage(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = {
          memories: Array.from(this.memories.entries()),
          timestamp: Date.now()
        };
        localStorage.setItem('openmind_memory', JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Failed to save memory to localStorage:', error);
    }
  }

  /**
   * Ngarkon nga localStorage
   */
  private loadFromStorage(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('openmind_memory');
        if (stored) {
          const data = JSON.parse(stored);
          this.memories = new Map(data.memories);
          
          // Rebuild search index
          this.searchIndex.clear();
          this.memories.forEach((memory, id) => {
            this.updateSearchIndex(id, memory.searchableText);
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load memory from localStorage:', error);
    }
  }

  /**
   * Pastron memorjen e vjetër
   */
  cleanOldMemories(maxAge: number = 30 * 24 * 60 * 60 * 1000): void { // 30 days
    const now = Date.now();
    const toDelete: string[] = [];
    
    this.memories.forEach((memory, id) => {
      if (now - memory.metadata.timestamp > maxAge && memory.accessCount < 2) {
        toDelete.push(id);
      }
    });
    
    toDelete.forEach(id => {
      this.memories.delete(id);
      // Remove from search index
      this.searchIndex.forEach((ids) => {
        ids.delete(id);
      });
    });
    
    if (toDelete.length > 0) {
      this.saveToStorage();
    }
  }
}

export default OpenMindMemory;
