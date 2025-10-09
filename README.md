# CLP MCP - Comprehensive DevOps Context Server

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

### Build

```bash
npm run build
```

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

### Kubernetes Security Scan
```typescript
// Scan Kubernetes manifests
{
  "tool": "k8s_security_scan",
  "arguments": {
    "resourcePath": "./k8s/",
    "scanType": "all",
    "severity": "high"
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

## Architecture

This MCP server is built with:
- **@modelcontextprotocol/sdk**: MCP TypeScript SDK
- **@smithery/sdk**: Smithery platform integration
- **zod**: Schema validation

The server provides:
- 31+ DevOps tools for infrastructure and CI/CD management
- 15+ knowledge resources with best practices
- 7 intelligent prompts for common scenarios
- Repository context memory and tracking

## Use Cases

### 1. DevOps Automation
- Analyze and optimize infrastructure configurations
- Generate CI/CD pipelines
- Validate Kubernetes deployments
- Audit security configurations

### 2. Cloud Operations
- Plan cloud migrations
- Optimize costs
- Design disaster recovery strategies
- Implement multi-cloud best practices

### 3. Knowledge Management
- Track repository changes and history
- Build knowledge graphs
- Store decisions and context
- Map infrastructure dependencies

### 4. Security & Compliance
- Security scanning and auditing
- Compliance framework alignment
- Best practices validation
- Vulnerability tracking

## Contributing

Contributions are welcome! Please see [DEVOPS.md](./DEVOPS.md) for information on adding new tools, resources, or prompts.

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
