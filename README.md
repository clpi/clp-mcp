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

## Quick Start

### Installation

#### From NPM
```bash
npm install -g clp-mcp
```

#### From Binary
Download the latest release for your platform from [GitHub Releases](https://github.com/clpi/clp-mcp/releases).

**Linux**:
```bash
wget https://github.com/clpi/clp-mcp/releases/latest/download/clp-mcp-linux-x64.tar.gz
tar -xzf clp-mcp-linux-x64.tar.gz
chmod +x clp-mcp-linux-x64
sudo mv clp-mcp-linux-x64 /usr/local/bin/clp-mcp
```

**macOS**:
```bash
# Homebrew (recommended)
brew tap clpi/tap
brew install clp-mcp

# Or download binary
wget https://github.com/clpi/clp-mcp/releases/latest/download/clp-mcp-darwin-x64.tar.gz
tar -xzf clp-mcp-darwin-x64.tar.gz
chmod +x clp-mcp-darwin-x64
sudo mv clp-mcp-darwin-x64 /usr/local/bin/clp-mcp
```

**Windows**:
```powershell
# Download from releases and extract
# Add to PATH or run directly
```

#### Package Managers

See [DISTRIBUTION.md](./DISTRIBUTION.md) for detailed installation instructions for:
- Debian/Ubuntu (APT)
- Fedora/RHEL (DNF/RPM)
- Arch Linux (AUR)
- NixOS (Nix)
- GNU Guix
- Snap
- Flatpak
- Docker

### Development

```bash
npm install
npm run dev
```

## Running

To run in development mode:

## Documentation

- [DEVOPS.md](./DEVOPS.md) - Comprehensive documentation of all tools, resources, and prompts
- [DISTRIBUTION.md](./DISTRIBUTION.md) - Installation and distribution guide for all platforms
- [QUICK_START.md](./QUICK_START.md) - Quick start guide for common use cases

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
