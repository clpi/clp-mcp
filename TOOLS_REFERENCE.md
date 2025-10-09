# Complete Tools Reference

This document provides a quick reference for all 28 tools available in the CLP MCP DevOps server.

## Memory System (6 tools)

| Tool | Description |
|------|-------------|
| `memory_store` | Store key-value pairs with metadata, tags, and categories |
| `memory_recall` | Retrieve specific key or all memory contents |
| `memory_delete` | Delete a key from memory |
| `memory_search` | Search memory by query string and optional category |
| `add_reasoning` | Record a reasoning step with context and decision |
| `get_reasoning_history` | Retrieve recent reasoning history |

## Jenkins Tools (3 tools)

| Tool | Description |
|------|-------------|
| `validate_jenkinsfile` | Validate Jenkinsfile for syntax and common issues |
| `generate_jenkinsfile` | Generate Jenkinsfile template based on project requirements |
| `analyze_jenkins_pipeline` | Analyze Jenkins pipeline for optimization opportunities |

**Supported Project Types**: nodejs, python, java, docker, terraform

## Ansible Tools (4 tools)

| Tool | Description |
|------|-------------|
| `validate_ansible_playbook` | Validate Ansible playbook for syntax and best practices |
| `generate_ansible_playbook` | Generate Ansible playbook template |
| `lint_ansible_playbook` | Check Ansible playbook for anti-patterns and style issues |
| `generate_ansible_inventory` | Generate Ansible inventory file (INI or YAML) |

**Supported Playbook Types**: webserver, database, docker, kubernetes, security_hardening, user_management

## Terraform Tools (5 tools)

| Tool | Description |
|------|-------------|
| `validate_terraform` | Validate Terraform configuration for syntax and best practices |
| `generate_terraform_module` | Generate Terraform module template |
| `format_terraform` | Format Terraform configuration to canonical style |
| `analyze_terraform_state` | Analyze Terraform state for insights and recommendations |
| `generate_terraform_backend` | Generate backend configuration for state management |

**Supported Module Types**: vpc, ec2, rds, s3, lambda, eks, iam, security_group  
**Supported Providers**: aws, azure, gcp  
**Supported Backends**: s3, azurerm, gcs, consul, kubernetes

## Kubernetes Tools (5 tools)

| Tool | Description |
|------|-------------|
| `validate_k8s_manifest` | Validate Kubernetes manifest for syntax and best practices |
| `generate_k8s_manifest` | Generate Kubernetes manifest template |
| `generate_helm_chart` | Generate Helm chart structure |
| `analyze_k8s_resources` | Analyze Kubernetes resources for optimization opportunities |
| `generate_kustomization` | Generate Kustomization file |

**Supported Resource Types**: deployment, service, configmap, secret, ingress, statefulset, daemonset, job, cronjob

## Docker Tools (5 tools)

| Tool | Description |
|------|-------------|
| `validate_dockerfile` | Validate Dockerfile for syntax and best practices |
| `generate_dockerfile` | Generate Dockerfile template based on project type |
| `generate_docker_compose` | Generate docker-compose.yml file |
| `optimize_dockerfile` | Suggest optimizations for Dockerfile |
| `analyze_docker_image` | Analyze Docker image structure and provide insights |

**Supported Project Types**: nodejs, python, java, go, rust, ruby, php, dotnet

## Resources (3)

| Resource | URI | Description |
|----------|-----|-------------|
| DevOps Best Practices | `clp://devops/best-practices` | Comprehensive guide to DevOps best practices |
| Jenkins Pipeline Examples | `clp://jenkins/examples` | Collection of Jenkins pipeline examples |
| Terraform Module Templates | `clp://terraform/modules` | Common Terraform module patterns |

## Prompts (2)

| Prompt | Description |
|--------|-------------|
| `infrastructure_audit` | Generate comprehensive infrastructure audit checklist |
| `deployment_strategy` | Create deployment strategy recommendation |

## Tool Categories by Use Case

### Infrastructure as Code
- Terraform: 5 tools
- Kubernetes: 5 tools
- Ansible: 4 tools

### CI/CD
- Jenkins: 3 tools

### Containers
- Docker: 5 tools

### State Management
- Memory: 6 tools

## Tool Input/Output Summary

### Memory Tools
- **Input**: JSON objects with keys, values, tags, categories
- **Output**: JSON responses with stored/retrieved data

### Jenkins Tools
- **Input**: Jenkinsfile content, project configurations
- **Output**: Jenkinsfile templates, validation results, analysis reports

### Ansible Tools
- **Input**: Playbook YAML, inventory data
- **Output**: Playbook templates, validation results, inventory files

### Terraform Tools
- **Input**: Terraform HCL, state JSON, backend configs
- **Output**: Module templates, formatted code, analysis reports

### Kubernetes Tools
- **Input**: Manifest YAML, resource configurations
- **Output**: Manifest templates, Helm charts, validation results

### Docker Tools
- **Input**: Dockerfile content, compose configurations
- **Output**: Dockerfile templates, compose files, optimization suggestions

## Common Parameters

### Memory Store
```typescript
{
  key: string,           // Required: Unique identifier
  value: any,            // Required: Data to store
  tags?: string[],       // Optional: Tags for organization
  category?: string      // Optional: Category (jenkins, ansible, etc.)
}
```

### Generate Tools
```typescript
{
  projectType: string,   // Type of project/resource
  options?: object,      // Additional configuration
  includeX?: boolean     // Optional features
}
```

### Validate Tools
```typescript
{
  content: string        // Required: Content to validate
}
```

## Error Handling

All tools return responses in the format:
```typescript
{
  content: [
    {
      type: "text",
      text: string       // JSON-formatted result or error message
    }
  ],
  isError?: boolean      // Present if operation failed
}
```

## Best Practices

1. **Memory Management**
   - Use descriptive keys
   - Tag consistently
   - Categorize appropriately
   - Clean up obsolete data

2. **Validation**
   - Always validate before deployment
   - Review warnings and recommendations
   - Test in non-production first

3. **Generation**
   - Customize generated templates
   - Review security settings
   - Adjust resource limits
   - Pin versions

4. **Reasoning**
   - Document major decisions
   - Include context
   - Explain trade-offs
   - Review history regularly

## Integration Examples

### With Claude Desktop
Add to your MCP settings:
```json
{
  "mcpServers": {
    "clp-mcp": {
      "command": "bun",
      "args": ["run", "/path/to/clp-mcp/src/index.ts"]
    }
  }
}
```

### With Custom Client
```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const client = new Client({
  name: "my-client",
  version: "1.0.0"
});

// Connect to server
await client.connect(transport);

// List available tools
const tools = await client.listTools();

// Call a tool
const result = await client.callTool({
  name: "generate_dockerfile",
  arguments: {
    projectType: "nodejs",
    includeMultiStage: true
  }
});
```

## Performance Notes

- **Memory Operations**: O(1) for store/recall by key, O(n) for search
- **Validation**: Fast (< 100ms) for most validations
- **Generation**: Instant template generation
- **Analysis**: Depends on input size, typically < 500ms

## Limitations

- Memory is session-scoped (not persistent across restarts)
- No file system operations (use external tools for that)
- Validation is syntax/best-practice only (not semantic)
- Templates require customization for production use

## Future Enhancements

Potential additions based on user feedback:
- Persistent memory storage
- More CI/CD platforms (GitHub Actions, GitLab CI)
- Cloud provider APIs (direct resource creation)
- More infrastructure tools (Pulumi, CloudFormation)
- Enhanced validation with external tools
- Template customization options

## Documentation Links

- [Complete API Documentation](./DEVOPS_TOOLS.md)
- [Quick Start Guide](./QUICK_START.md)
- [Usage Examples](./examples/)
- [Main README](./README.md)
