# Quick Start Guide

Get up and running with the CLP MCP DevOps server in minutes.

## Installation

```bash
# Clone the repository
git clone https://github.com/clpi/clp-mcp.git
cd clp-mcp

# Install dependencies
bun install

# Start development server
bun run dev
```

## First Steps

### 1. Store Your First Infrastructure Data

```json
{
  "tool": "memory_store",
  "arguments": {
    "key": "my_vpc",
    "value": {
      "vpc_id": "vpc-12345",
      "cidr": "10.0.0.0/16"
    },
    "tags": ["networking"],
    "category": "terraform"
  }
}
```

### 2. Generate a Jenkins Pipeline

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

### 3. Create a Kubernetes Deployment

```json
{
  "tool": "generate_k8s_manifest",
  "arguments": {
    "resourceType": "deployment",
    "name": "myapp",
    "namespace": "production",
    "options": {
      "replicas": 3,
      "image": "myapp:v1.0.0",
      "port": 8080
    }
  }
}
```

### 4. Generate a Dockerfile

```json
{
  "tool": "generate_dockerfile",
  "arguments": {
    "projectType": "nodejs",
    "includeMultiStage": true
  }
}
```

### 5. Track Your Reasoning

```json
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Choosing between ECS and EKS for container orchestration",
    "decision": "Selected EKS for better Kubernetes ecosystem and portability"
  }
}
```

## Tool Categories

### 🧠 Memory (6 tools)
- `memory_store` - Store data with tags and categories
- `memory_recall` - Retrieve stored data
- `memory_delete` - Delete stored data
- `memory_search` - Search across stored data
- `add_reasoning` - Track decisions
- `get_reasoning_history` - Review past decisions

### 🔨 Jenkins (3 tools)
- `validate_jenkinsfile` - Check pipeline syntax
- `generate_jenkinsfile` - Create pipeline templates
- `analyze_jenkins_pipeline` - Find optimization opportunities

### 📦 Ansible (4 tools)
- `validate_ansible_playbook` - Check playbook best practices
- `generate_ansible_playbook` - Create playbook templates
- `lint_ansible_playbook` - Detect anti-patterns
- `generate_ansible_inventory` - Create inventory files

### 🏗️ Terraform (5 tools)
- `validate_terraform` - Check configuration syntax
- `generate_terraform_module` - Create module templates
- `format_terraform` - Format code
- `analyze_terraform_state` - Analyze state files
- `generate_terraform_backend` - Create backend config

### ☸️ Kubernetes (5 tools)
- `validate_k8s_manifest` - Check manifest best practices
- `generate_k8s_manifest` - Create resource templates
- `generate_helm_chart` - Create Helm charts
- `analyze_k8s_resources` - Find optimization opportunities
- `generate_kustomization` - Create Kustomization files

### 🐳 Docker (5 tools)
- `validate_dockerfile` - Check Dockerfile best practices
- `generate_dockerfile` - Create Dockerfile templates
- `generate_docker_compose` - Create compose files
- `optimize_dockerfile` - Get optimization suggestions
- `analyze_docker_image` - Analyze image structure

## Common Workflows

### Infrastructure Setup
1. Generate Terraform modules
2. Validate configurations
3. Store infrastructure IDs in memory
4. Track reasoning for decisions

### CI/CD Pipeline
1. Generate Jenkinsfile
2. Validate pipeline syntax
3. Analyze for optimizations
4. Store pipeline in memory

### Container Deployment
1. Generate Dockerfile
2. Validate and optimize
3. Create Kubernetes manifests
4. Generate Helm chart
5. Deploy to cluster

### Configuration Management
1. Generate Ansible playbooks
2. Validate and lint
3. Create inventory files
4. Execute playbooks
5. Store results in memory

## Tips

- **Use Tags**: Organize data with consistent tags (`production`, `staging`, etc.)
- **Categorize**: Use categories to group by tool type
- **Track Decisions**: Use reasoning tools to document why you made choices
- **Search First**: Check memory before creating new configs
- **Validate Always**: Always validate before deploying

## Next Steps

- Read [DEVOPS_TOOLS.md](./DEVOPS_TOOLS.md) for complete API reference
- Explore [examples/](./examples/) for detailed workflows
- Check [AGENTS.md](./AGENTS.md) for deployment guide

## Troubleshooting

### Build Fails
```bash
bun install
bun run build
```

### Port Already in Use
```bash
# Change port in index.ts or use different port
bun run dev -- --port 3001
```

### Import Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .smithery
bun install
bun run build
```

## Support

- 📚 [Complete Documentation](./DEVOPS_TOOLS.md)
- 💡 [Examples](./examples/)
- 🐛 [Report Issues](https://github.com/clpi/clp-mcp/issues)
- 💬 [Discussions](https://github.com/clpi/clp-mcp/discussions)
