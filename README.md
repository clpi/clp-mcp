# CLP MCP - Comprehensive DevOps Context Server

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

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Documentation

See [DEVOPS.md](./DEVOPS.md) for comprehensive documentation of all tools, resources, and prompts.

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
