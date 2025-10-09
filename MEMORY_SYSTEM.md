# Dynamic Long-Term Memory System

The CLP MCP server now includes a comprehensive dynamic long-term memory system that leverages all available information sources from the past and present to provide informed decision-making and next steps.

## Overview

The memory system provides:

- **Intelligent Storage**: Store memories with rich metadata including context, tags, importance, and custom metadata
- **Smart Retrieval**: Advanced search and recall capabilities with relevance ranking
- **Temporal Awareness**: Track when memories were created and accessed
- **Relationship Mapping**: Automatically identify and link related memories
- **Pattern Detection**: Consolidate memories to identify recurring patterns
- **Access Analytics**: Track memory access frequency and recency

## Architecture

### Core Components

1. **LongTermMemory Class** (`src/memory/index.ts`)
   - In-memory storage with multiple indices
   - Context index for organizing by category
   - Tag index for multi-dimensional categorization
   - Timeline index for temporal queries

2. **Memory Entry Schema**
   ```typescript
   {
     id: string;              // Unique identifier
     content: string;         // The actual memory content
     timestamp: number;       // When the memory was created
     context?: string;        // Category/context
     tags: string[];          // Tags for categorization
     importance: number;      // Score from 0-1
     accessCount: number;     // How many times accessed
     lastAccessed?: number;   // Last access timestamp
     metadata: Record<any>;   // Custom metadata
     relatedMemories: string[]; // IDs of related memories
   }
   ```

### Intelligent Features

#### 1. Relevance Scoring
Memories are ranked based on:
- **Content match**: Direct text matching
- **Tag match**: Matching tags (0.5 weight per tag)
- **Context match**: Context similarity (0.5 weight)
- **Importance boost**: Multiplied by (1 + importance)
- **Access frequency**: Logarithmic boost based on access count

#### 2. Dynamic Scoring
When sorting without a query, memories are scored by:
- **Recency** (40%): Exponential decay over time (1 week half-life)
- **Importance** (40%): User-defined importance score
- **Access frequency** (20%): How often the memory is accessed

#### 3. Related Memory Detection
Memories are automatically linked based on:
- Shared context (0.5 similarity)
- Common tags (proportional to overlap)
- Similarity threshold: 0.5 for automatic linking

## MCP Tools

The memory system exposes the following tools:

### 1. `memory_store`
Store a new memory with optional metadata.

**Parameters:**
- `content` (required): The content to store
- `context` (optional): Context or category
- `tags` (optional): Array of tags
- `importance` (optional): Score from 0-1
- `metadata` (optional): Custom metadata object

**Example:**
```json
{
  "content": "Implemented authentication system using JWT tokens",
  "context": "development",
  "tags": ["auth", "security", "backend"],
  "importance": 0.9,
  "metadata": { "project": "clp-mcp" }
}
```

### 2. `memory_recall`
Recall memories based on multiple criteria.

**Parameters:**
- `query` (optional): Full-text search query
- `context` (optional): Filter by context
- `tags` (optional): Filter by tags
- `limit` (optional): Max results (default: 10)
- `minImportance` (optional): Minimum importance score

**Example:**
```json
{
  "query": "authentication",
  "context": "development",
  "minImportance": 0.7,
  "limit": 5
}
```

### 3. `memory_search`
Full-text search across all memories.

**Parameters:**
- `query` (required): Search query
- `limit` (optional): Max results (default: 10)

### 4. `memory_get_recent`
Get the most recently stored memories.

**Parameters:**
- `limit` (optional): Max results (default: 10)

### 5. `memory_get_important`
Get high-importance memories.

**Parameters:**
- `minImportance` (optional): Minimum importance (default: 0.7)
- `limit` (optional): Max results (default: 10)

### 6. `memory_stats`
Get statistics about the memory system.

**Returns:**
- Total memories
- Total contexts
- Total tags
- Average importance
- Oldest/newest memory timestamps

### 7. `memory_consolidate`
Analyze memories to identify patterns and generate summaries.

**Parameters:**
- `context` (optional): Consolidate specific context only

**Returns:**
- Patterns: Recurring tags and their frequencies
- Summary: Overview of most important memories

## MCP Resources

The memory system exposes the following resources:

### 1. `memory://all`
Access all stored memories in JSON format.

### 2. `memory://stats`
Current memory system statistics in JSON format.

### 3. `memory://recent`
Most recently stored memories (last 20).

### 4. `memory://important`
High-importance memories (importance >= 0.7, last 20).

## Usage Examples

### Storing Project Information
```typescript
// Store a critical bug fix
memory_store({
  content: "Fixed memory leak in WebSocket handler",
  context: "development",
  tags: ["bugfix", "critical", "websocket"],
  importance: 0.95,
  metadata: { 
    commit: "abc123",
    issue: "#456"
  }
})
```

### Recalling Related Work
```typescript
// Find all security-related work
memory_recall({
  tags: ["security"],
  minImportance: 0.7
})
```

### Understanding Patterns
```typescript
// Consolidate development work to see patterns
memory_consolidate({
  context: "development"
})
```

## Use Cases

### 1. Project Context Maintenance
Store and recall information about:
- Feature implementations
- Bug fixes and their solutions
- Architecture decisions
- Code review feedback

### 2. Learning and Research
Track:
- Research findings
- Best practices discovered
- Documentation references
- Lessons learned

### 3. Collaboration
Remember:
- Team discussions
- Meeting decisions
- User feedback
- Support tickets

### 4. Workflow Optimization
Identify:
- Recurring issues
- Common patterns
- Frequently accessed information
- High-value memories

## Best Practices

### 1. Use Meaningful Contexts
Organize memories by logical categories:
- `development` - Code and technical work
- `planning` - Roadmaps and strategy
- `support` - User issues and feedback
- `research` - Learning and exploration
- `meetings` - Discussions and decisions

### 2. Tag Consistently
Use consistent tag naming:
- Technology: `javascript`, `python`, `react`
- Type: `bugfix`, `feature`, `refactor`
- Priority: `critical`, `important`, `nice-to-have`

### 3. Set Importance Appropriately
- **0.9-1.0**: Critical, frequently-needed information
- **0.7-0.9**: Important, regularly referenced
- **0.5-0.7**: Useful, occasionally needed
- **0.0-0.5**: Low priority, rarely accessed

### 4. Add Rich Metadata
Include useful context:
```json
{
  "metadata": {
    "project": "clp-mcp",
    "author": "developer-name",
    "commit": "abc123",
    "issue": "#456",
    "url": "https://..."
  }
}
```

### 5. Regular Consolidation
Periodically run `memory_consolidate` to:
- Identify patterns
- Clean up duplicates
- Generate summaries
- Update importance scores

## Implementation Details

### Performance Characteristics

- **Storage**: O(1) for adding new memories
- **Search**: O(n) for full-text search with relevance ranking
- **Context lookup**: O(1) with index
- **Tag lookup**: O(1) with index
- **Related memory detection**: O(n) on store

### Memory Management

The system uses in-memory storage with:
- Map-based primary storage
- Set-based indices for fast lookups
- Sorted arrays for timeline queries

For production use, consider:
- Persisting to disk/database
- Implementing pagination
- Adding memory limits/eviction policies
- Caching frequently accessed memories

### Future Enhancements

Potential improvements:
1. **Persistent Storage**: Save to database or file
2. **Vector Embeddings**: Semantic similarity search
3. **Memory Decay**: Automatic importance reduction over time
4. **Smart Summarization**: AI-powered memory summaries
5. **Cross-session Sharing**: Share memories across users
6. **Export/Import**: Backup and restore capabilities

## Testing

Run the test script to verify functionality:

```bash
npx tsx test-memory.ts
```

The test suite validates:
- ✅ Memory storage with metadata
- ✅ Statistical tracking
- ✅ Full-text search
- ✅ Context-based filtering
- ✅ Tag-based filtering
- ✅ Recent memory retrieval
- ✅ Importance-based filtering
- ✅ Multi-criteria recall
- ✅ Memory consolidation
- ✅ Memory updates
- ✅ Export functionality

## Contributing

When extending the memory system:

1. Maintain backward compatibility
2. Add comprehensive tests
3. Document new features
4. Consider performance implications
5. Update this documentation

## License

Part of the CLP MCP server project.
