# CLP MCP - DevOps Infrastructure Server

A comprehensive Model Context Protocol (MCP) server designed for DevOps and infrastructure management. This server provides extensive tooling for Jenkins, Ansible, Terraform, Kubernetes, and Docker, along with a sophisticated memory system for context retention and reasoning tracking.

## Features

### 🧠 Memory System
- **Store & Recall**: Persistent key-value storage with metadata
- **Search**: Full-text search across stored data with category filtering
- **Reasoning Tracking**: Record and retrieve decision-making context
- **Context Management**: Maintain state across interactions

### 🔧 DevOps Tools

#### Jenkins
- Validate Jenkinsfiles for syntax and security issues
- Generate pipeline templates for multiple project types
- Analyze pipelines for optimization opportunities

#### Ansible
- Validate playbooks for best practices
- Generate playbook templates (webserver, database, K8s, etc.)
- Lint playbooks for anti-patterns
- Generate inventory files (INI/YAML)

#### Terraform
- Validate configurations and detect security issues
- Generate module templates (VPC, EC2, RDS, S3, etc.)
- Format code to canonical style
- Analyze state files
- Generate backend configurations

#### Kubernetes
- Validate manifests against best practices
- Generate resource templates (Deployments, Services, etc.)
- Create Helm charts
- Analyze resources for optimization
- Generate Kustomization files

#### Docker
- Validate Dockerfiles for security and optimization
- Generate multi-stage Dockerfile templates
- Create docker-compose.yml files
- Optimize existing Dockerfiles
- Analyze image structures

### 📚 Resources
- DevOps best practices documentation
- Jenkins pipeline examples
- Terraform module patterns

### 💡 Prompts
- Infrastructure audit checklists
- Deployment strategy recommendations

## Installation

```bash
bun install
```

## Development

Run the development server with hot reload:

```bash
bun run dev
```

## Build

Build for production:

```bash
bun run build
```

## Usage

This MCP server can be used with any MCP-compatible client (Claude Desktop, etc.). See [DEVOPS_TOOLS.md](./DEVOPS_TOOLS.md) for comprehensive documentation of all tools and usage examples.

### Quick Examples

**Store Infrastructure Info:**
```json
{
  "tool": "memory_store",
  "arguments": {
    "key": "prod_vpc_id",
    "value": "vpc-12345",
    "tags": ["production", "networking"],
    "category": "terraform"
  }
}
```

**Generate Jenkins Pipeline:**
```json
{
  "tool": "generate_jenkinsfile",
  "arguments": {
    "projectType": "nodejs",
    "stages": ["build", "test", "deploy"],
    "agent": "docker"
  }
}
```

**Validate Kubernetes Manifest:**
```json
{
  "tool": "validate_k8s_manifest",
  "arguments": {
    "content": "apiVersion: apps/v1\nkind: Deployment\n..."
  }
}
```

## Documentation

- **[DEVOPS_TOOLS.md](./DEVOPS_TOOLS.md)**: Complete tool reference and usage examples
- **[AGENTS.md](./AGENTS.md)**: Development and deployment guide

## Architecture

Built on:
- **@modelcontextprotocol/sdk**: Official MCP TypeScript SDK
- **@smithery/sdk**: Smithery platform integration
- **Zod**: Schema validation
- **Bun**: Fast JavaScript runtime

## Memory System Architecture

The memory system provides:
1. **Key-Value Storage**: Store any JSON-serializable data with metadata
2. **Tagging**: Organize data with multiple tags
3. **Categories**: Group data by infrastructure type
4. **Search**: Full-text search across keys, values, and tags
5. **Reasoning History**: Track decision-making context and rationale
6. **Context Management**: Session-specific context storage

## Tool Categories

### Memory (6 tools)
- memory_store, memory_recall, memory_delete
- memory_search, add_reasoning, get_reasoning_history

### Jenkins (3 tools)
- validate_jenkinsfile, generate_jenkinsfile, analyze_jenkins_pipeline

### Ansible (4 tools)
- validate_ansible_playbook, generate_ansible_playbook
- lint_ansible_playbook, generate_ansible_inventory

### Terraform (5 tools)
- validate_terraform, generate_terraform_module, format_terraform
- analyze_terraform_state, generate_terraform_backend

### Kubernetes (5 tools)
- validate_k8s_manifest, generate_k8s_manifest, generate_helm_chart
- analyze_k8s_resources, generate_kustomization

### Docker (5 tools)
- validate_dockerfile, generate_dockerfile, generate_docker_compose
- optimize_dockerfile, analyze_docker_image

**Total: 28 tools** for comprehensive DevOps infrastructure management

## Contributing

Contributions are welcome! Please ensure all tools follow the established patterns and include comprehensive error handling.

## License

ISC

## Project Info

This project uses [Bun](https://bun.com), a fast all-in-one JavaScript runtime.
