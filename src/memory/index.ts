import { z } from "zod";

/**
 * Memory entry schema representing a single memory item
 */
export const MemoryEntrySchema = z.object({
  id: z.string().describe("Unique identifier for the memory entry"),
  content: z.string().describe("The actual content of the memory"),
  timestamp: z.number().describe("Unix timestamp when the memory was created"),
  context: z.string().optional().describe("Context or category for the memory"),
  tags: z.array(z.string()).default([]).describe("Tags for categorization"),
  importance: z.number().min(0).max(1).default(0.5).describe("Importance score (0-1)"),
  accessCount: z.number().default(0).describe("Number of times this memory was accessed"),
  lastAccessed: z.number().optional().describe("Last access timestamp"),
  metadata: z.record(z.any()).default({}).describe("Additional metadata"),
  relatedMemories: z.array(z.string()).default([]).describe("IDs of related memories"),
});

export type MemoryEntry = z.infer<typeof MemoryEntrySchema>;

/**
 * Dynamic long-term memory system that provides intelligent storage,
 * retrieval, and analysis of information over time
 */
export class LongTermMemory {
  private memories: Map<string, MemoryEntry> = new Map();
  private contextIndex: Map<string, Set<string>> = new Map(); // context -> memory IDs
  private tagIndex: Map<string, Set<string>> = new Map(); // tag -> memory IDs
  private timelineIndex: Array<{ timestamp: number; id: string }> = [];

  /**
   * Store a new memory entry
   */
  store(params: {
    content: string;
    context?: string;
    tags?: string[];
    importance?: number;
    metadata?: Record<string, any>;
  }): MemoryEntry {
    const id = this.generateId();
    const timestamp = Date.now();

    const memory: MemoryEntry = {
      id,
      content: params.content,
      timestamp,
      context: params.context,
      tags: params.tags || [],
      importance: params.importance || 0.5,
      accessCount: 0,
      metadata: params.metadata || {},
      relatedMemories: [],
    };

    // Store the memory
    this.memories.set(id, memory);

    // Update indices
    this.updateIndices(memory);

    // Find and link related memories
    this.linkRelatedMemories(memory);

    return memory;
  }

  /**
   * Recall memories based on various criteria
   */
  recall(params: {
    query?: string;
    context?: string;
    tags?: string[];
    limit?: number;
    minImportance?: number;
    timeRange?: { start?: number; end?: number };
  }): MemoryEntry[] {
    let candidates = Array.from(this.memories.values());

    // Filter by context
    if (params.context && this.contextIndex.has(params.context)) {
      const contextIds = this.contextIndex.get(params.context)!;
      candidates = candidates.filter((m) => contextIds.has(m.id));
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      candidates = candidates.filter((m) =>
        params.tags!.some((tag) => m.tags.includes(tag))
      );
    }

    // Filter by importance
    if (params.minImportance !== undefined) {
      candidates = candidates.filter((m) => m.importance >= params.minImportance!);
    }

    // Filter by time range
    if (params.timeRange) {
      candidates = candidates.filter((m) => {
        if (params.timeRange!.start && m.timestamp < params.timeRange!.start) {
          return false;
        }
        if (params.timeRange!.end && m.timestamp > params.timeRange!.end) {
          return false;
        }
        return true;
      });
    }

    // Search by query if provided
    if (params.query) {
      const queryLower = params.query.toLowerCase();
      candidates = candidates
        .map((m) => ({
          memory: m,
          relevance: this.calculateRelevance(m, queryLower),
        }))
        .filter((item) => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .map((item) => item.memory);
    } else {
      // Sort by recency and importance if no query
      candidates.sort((a, b) => {
        const scoreA = this.calculateScore(a);
        const scoreB = this.calculateScore(b);
        return scoreB - scoreA;
      });
    }

    // Update access counts
    const limit = params.limit || 10;
    const results = candidates.slice(0, limit);
    results.forEach((m) => {
      m.accessCount++;
      m.lastAccessed = Date.now();
    });

    return results;
  }

  /**
   * Search memories with full-text search
   */
  search(query: string, limit: number = 10): MemoryEntry[] {
    return this.recall({ query, limit });
  }

  /**
   * Get memories by context
   */
  getByContext(context: string, limit: number = 10): MemoryEntry[] {
    return this.recall({ context, limit });
  }

  /**
   * Get memories by tags
   */
  getByTags(tags: string[], limit: number = 10): MemoryEntry[] {
    return this.recall({ tags, limit });
  }

  /**
   * Get recent memories
   */
  getRecent(limit: number = 10): MemoryEntry[] {
    const sorted = Array.from(this.memories.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
    return sorted.slice(0, limit);
  }

  /**
   * Get important memories
   */
  getImportant(minImportance: number = 0.7, limit: number = 10): MemoryEntry[] {
    return this.recall({ minImportance, limit });
  }

  /**
   * Update a memory entry
   */
  update(id: string, updates: Partial<Omit<MemoryEntry, "id" | "timestamp">>): MemoryEntry | null {
    const memory = this.memories.get(id);
    if (!memory) return null;

    // Remove old indices
    this.removeFromIndices(memory);

    // Apply updates
    Object.assign(memory, updates);

    // Update indices
    this.updateIndices(memory);

    return memory;
  }

  /**
   * Delete a memory
   */
  delete(id: string): boolean {
    const memory = this.memories.get(id);
    if (!memory) return false;

    this.removeFromIndices(memory);
    this.memories.delete(id);

    // Remove from related memories
    memory.relatedMemories.forEach((relatedId) => {
      const related = this.memories.get(relatedId);
      if (related) {
        related.relatedMemories = related.relatedMemories.filter(
          (rid) => rid !== id
        );
      }
    });

    return true;
  }

  /**
   * Get memory statistics
   */
  getStats(): {
    totalMemories: number;
    totalContexts: number;
    totalTags: number;
    oldestMemory?: number;
    newestMemory?: number;
    avgImportance: number;
  } {
    const memories = Array.from(this.memories.values());
    const timestamps = memories.map((m) => m.timestamp);

    return {
      totalMemories: memories.length,
      totalContexts: this.contextIndex.size,
      totalTags: this.tagIndex.size,
      oldestMemory: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
      newestMemory: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
      avgImportance:
        memories.length > 0
          ? memories.reduce((sum, m) => sum + m.importance, 0) / memories.length
          : 0,
    };
  }

  /**
   * Consolidate memories - identify patterns and create summaries
   */
  consolidate(context?: string): {
    patterns: Array<{ pattern: string; count: number; memoryIds: string[] }>;
    summary: string;
  } {
    let memories = Array.from(this.memories.values());

    if (context) {
      const contextIds = this.contextIndex.get(context);
      if (contextIds) {
        memories = memories.filter((m) => contextIds.has(m.id));
      }
    }

    // Find patterns in tags
    const tagPatterns = new Map<string, string[]>();
    memories.forEach((m) => {
      m.tags.forEach((tag) => {
        if (!tagPatterns.has(tag)) {
          tagPatterns.set(tag, []);
        }
        tagPatterns.get(tag)!.push(m.id);
      });
    });

    const patterns = Array.from(tagPatterns.entries())
      .map(([pattern, memoryIds]) => ({
        pattern,
        count: memoryIds.length,
        memoryIds,
      }))
      .filter((p) => p.count > 1)
      .sort((a, b) => b.count - a.count);

    // Generate summary
    const summary = this.generateSummary(memories);

    return { patterns, summary };
  }

  /**
   * Export all memories
   */
  export(): MemoryEntry[] {
    return Array.from(this.memories.values());
  }

  /**
   * Import memories
   */
  import(memories: MemoryEntry[]): void {
    memories.forEach((memory) => {
      this.memories.set(memory.id, memory);
      this.updateIndices(memory);
    });
  }

  /**
   * Clear all memories
   */
  clear(): void {
    this.memories.clear();
    this.contextIndex.clear();
    this.tagIndex.clear();
    this.timelineIndex = [];
  }

  // Private helper methods

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateIndices(memory: MemoryEntry): void {
    // Update context index
    if (memory.context) {
      if (!this.contextIndex.has(memory.context)) {
        this.contextIndex.set(memory.context, new Set());
      }
      this.contextIndex.get(memory.context)!.add(memory.id);
    }

    // Update tag index
    memory.tags.forEach((tag) => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(memory.id);
    });

    // Update timeline
    this.timelineIndex.push({ timestamp: memory.timestamp, id: memory.id });
    this.timelineIndex.sort((a, b) => a.timestamp - b.timestamp);
  }

  private removeFromIndices(memory: MemoryEntry): void {
    // Remove from context index
    if (memory.context) {
      const contextSet = this.contextIndex.get(memory.context);
      if (contextSet) {
        contextSet.delete(memory.id);
        if (contextSet.size === 0) {
          this.contextIndex.delete(memory.context);
        }
      }
    }

    // Remove from tag index
    memory.tags.forEach((tag) => {
      const tagSet = this.tagIndex.get(tag);
      if (tagSet) {
        tagSet.delete(memory.id);
        if (tagSet.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    });

    // Remove from timeline
    this.timelineIndex = this.timelineIndex.filter((item) => item.id !== memory.id);
  }

  private calculateRelevance(memory: MemoryEntry, query: string): number {
    let score = 0;

    // Content match
    const content = memory.content.toLowerCase();
    if (content.includes(query)) {
      score += 1.0;
    }

    // Tag match
    const matchingTags = memory.tags.filter((tag) =>
      tag.toLowerCase().includes(query)
    );
    score += matchingTags.length * 0.5;

    // Context match
    if (memory.context && memory.context.toLowerCase().includes(query)) {
      score += 0.5;
    }

    // Boost by importance
    score *= 1 + memory.importance;

    // Boost by access frequency
    score *= 1 + Math.log(memory.accessCount + 1) * 0.1;

    return score;
  }

  private calculateScore(memory: MemoryEntry): number {
    const recencyWeight = 0.4;
    const importanceWeight = 0.4;
    const accessWeight = 0.2;

    // Recency score (newer is better)
    const age = Date.now() - memory.timestamp;
    const recencyScore = Math.exp(-age / (7 * 24 * 60 * 60 * 1000)); // Decay over 1 week

    // Importance score
    const importanceScore = memory.importance;

    // Access score
    const accessScore = Math.min(memory.accessCount / 10, 1);

    return (
      recencyWeight * recencyScore +
      importanceWeight * importanceScore +
      accessWeight * accessScore
    );
  }

  private linkRelatedMemories(memory: MemoryEntry): void {
    const candidates = Array.from(this.memories.values()).filter(
      (m) => m.id !== memory.id
    );

    candidates.forEach((candidate) => {
      const similarity = this.calculateSimilarity(memory, candidate);
      if (similarity > 0.5) {
        // Link if similarity is above threshold
        if (!memory.relatedMemories.includes(candidate.id)) {
          memory.relatedMemories.push(candidate.id);
        }
        if (!candidate.relatedMemories.includes(memory.id)) {
          candidate.relatedMemories.push(memory.id);
        }
      }
    });
  }

  private calculateSimilarity(m1: MemoryEntry, m2: MemoryEntry): number {
    let similarity = 0;

    // Context similarity
    if (m1.context && m2.context && m1.context === m2.context) {
      similarity += 0.5;
    }

    // Tag similarity
    const commonTags = m1.tags.filter((tag) => m2.tags.includes(tag));
    if (m1.tags.length > 0 && m2.tags.length > 0) {
      similarity += (commonTags.length / Math.max(m1.tags.length, m2.tags.length)) * 0.5;
    }

    return similarity;
  }

  private generateSummary(memories: MemoryEntry[]): string {
    if (memories.length === 0) {
      return "No memories to summarize.";
    }

    const sortedByImportance = memories
      .slice()
      .sort((a, b) => b.importance - a.importance);

    const topMemories = sortedByImportance.slice(0, 5);

    const summary = [
      `Summary of ${memories.length} memories:`,
      "",
      "Most important memories:",
      ...topMemories.map(
        (m, i) =>
          `${i + 1}. [${new Date(m.timestamp).toLocaleDateString()}] ${m.content.substring(0, 100)}${m.content.length > 100 ? "..." : ""}`
      ),
    ];

    return summary.join("\n");
  }
}
