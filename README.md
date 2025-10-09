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

[![Build Check](https://github.com/clpi/clp-mcp/actions/workflows/check.yml/badge.svg)](https://github.com/clpi/clp-mcp/actions/workflows/check.yml)
[![CodeQL](https://github.com/clpi/clp-mcp/actions/workflows/codeql.yml/badge.svg)](https://github.com/clpi/clp-mcp/actions/workflows/codeql.yml)
[![Docker Image](https://github.com/clpi/clp-mcp/actions/workflows/docker-image.yml/badge.svg)](https://github.com/clpi/clp-mcp/actions/workflows/docker-image.yml)

A Model Context Protocol (MCP) server providing extensive DevOps tools, resources, and context memory for infrastructure management, CI/CD, and cloud operations.

## Features

### 🧠 Knowledge Graph & Context Awareness
- **Entity Management**: Model services, infrastructure, people, and concepts as entities
- **Relationship Mapping**: Define and query dependencies, ownership, and connections
- **Graph Traversal**: Find paths, analyze impact, discover dependency chains
- **Memory Integration**: Link contextual information to entities for rich context
- **Visualization Export**: Generate graph data for D3.js, Cytoscape, and other tools

### 🔧 DevOps Tools
- **Ansible**: Playbook analysis, role generation, inventory management, and Vault operations
- **Jenkins**: Pipeline analysis and generation, plugin lookup, credential management
- **Kubernetes**: Manifest analysis, resource generation, security scanning, Helm chart support
- **Cloud Services**: Infrastructure analysis, cost optimization, migration planning (AWS, Azure, GCP)
- **Repository Context**: History tracking, file changes, dependency analysis, knowledge graphs

### 📚 Knowledge Resources
- Ansible best practices, modules, and playbook patterns
- Jenkins pipeline patterns, shared libraries, and essential plugins
- Kubernetes security, manifest patterns, and Helm best practices
- Cloud provider best practices (AWS Well-Architected, Azure, GCP)
- Terraform/IaC patterns and best practices

### 💡 Intelligent Prompts
- Infrastructure provisioning plans
- CI/CD pipeline generation
- Kubernetes deployment configurations
- Ansible playbook generation
- Cloud migration strategies
- Disaster recovery plans
- Security audit checklists

## Installation

### NPM (for development)

#### From NPM
```bash
npm install
npm run dev
```

### Pre-built Binaries

Download binaries for your platform from [GitHub Releases](https://github.com/clpi/clp-mcp/releases):

**Linux**:
```bash
# Linux
curl -L -o clp-mcp https://github.com/clpi/clp-mcp/releases/latest/download/clp-mcp-linux-x64
chmod +x clp-mcp

# macOS (Intel)
curl -L -o clp-mcp https://github.com/clpi/clp-mcp/releases/latest/download/clp-mcp-darwin-x64
chmod +x clp-mcp

# macOS (Apple Silicon)
curl -L -o clp-mcp https://github.com/clpi/clp-mcp/releases/latest/download/clp-mcp-darwin-arm64
chmod +x clp-mcp
```

### Package Managers

**Homebrew (macOS)**
```bash
brew tap clpi/tap
brew install clp-mcp
```

**Nix/NixOS**
```bash
nix profile install github:clpi/clp-mcp
```

**AUR (Arch Linux)**
```bash
yay -S clp-mcp-bin
```

**DNF/RPM (Fedora, RHEL, CentOS)**
```bash
sudo dnf install ./clp-mcp-*.rpm
```

**Guix**
```bash
guix install clp-mcp
```

See [DISTRIBUTION.md](./DISTRIBUTION.md) for detailed installation instructions and package manager setup.

## Documentation

- [DEVOPS.md](./DEVOPS.md) - Comprehensive documentation of all DevOps tools, resources, and prompts
- [DEVOPS_TOOLS.md](./DEVOPS_TOOLS.md) - Detailed tool reference and usage examples
- [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md) - Complete guide to the knowledge graph system
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

## Usage Examples

### Infrastructure Analysis
```typescript
// Analyze Terraform configuration
{
  "tool": "cloud_analyze_infrastructure",
  "arguments": {
    "configPath": "./terraform/main.tf",
    "provider": "aws",
    "configType": "terraform",
    "checkCosts": true
  }
}
```

To build:

### Knowledge Graph - Model Infrastructure
```typescript
// Create entities for your infrastructure
{
  "tool": "add_entity",
  "arguments": {
    "type": "service",
    "properties": {
      "name": "api-gateway",
      "version": "2.0.0",
      "port": 8080
    },
    "tags": ["microservice", "critical"]
  }
}

// Define relationships between components
{
  "tool": "add_relationship",
  "arguments": {
    "sourceId": "api-gateway-id",
    "targetId": "auth-service-id",
    "relationshipType": "depends_on",
    "weight": 0.9
  }
}

// Traverse the graph for impact analysis
{
  "tool": "traverse_graph",
  "arguments": {
    "sourceId": "frontend-id",
    "targetId": "database-id",
    "maxDepth": 5
  }
}
```

### Repository Knowledge Graph
```typescript
// Build knowledge graph of repository
{
  "tool": "repo_knowledge_graph",
  "arguments": {
    "repoPath": "/path/to/repo",
    "depth": "deep",
    "includeExternal": true
  }
}
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
