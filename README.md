# CLP MCP Server

A Model Context Protocol (MCP) server with a dynamic long-term memory system.

## Features

### 🧠 Dynamic Long-Term Memory System

The CLP MCP server includes a comprehensive memory system that provides:

- **Intelligent Storage**: Store information with rich metadata (context, tags, importance)
- **Smart Retrieval**: Advanced search and recall with relevance ranking
- **Temporal Awareness**: Track when information was created and accessed
- **Relationship Mapping**: Automatically identify related memories
- **Pattern Detection**: Identify recurring patterns across stored information
- **Access Analytics**: Track usage patterns and access frequency

See [MEMORY_SYSTEM.md](./MEMORY_SYSTEM.md) for detailed documentation.

### Available MCP Tools

- `memory_store` - Store new memories with metadata
- `memory_recall` - Recall memories with advanced filtering
- `memory_search` - Full-text search across memories
- `memory_get_recent` - Get recently stored memories
- `memory_get_important` - Get high-importance memories
- `memory_stats` - Get memory system statistics
- `memory_consolidate` - Identify patterns and generate summaries

### Available MCP Resources

- `memory://all` - Access all stored memories
- `memory://stats` - Memory system statistics
- `memory://recent` - Recent memories
- `memory://important` - Important memories

## Installation

To install dependencies:

```bash
npm install
```

## Running

To run in development mode:

```bash
npm run dev
```

To build:

```bash
npm run build
```

## Testing

Test the memory system:

```bash
npx tsx test-memory.ts
```

## Documentation

- [Memory System Documentation](./MEMORY_SYSTEM.md) - Comprehensive guide to the memory system
- [Agent Guidelines](./AGENTS.md) - Development workflow and guidelines

This project was created using `bun init` in bun v1.2.23. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
