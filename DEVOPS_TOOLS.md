# DevOps Tools Documentation

This MCP server provides comprehensive tooling for DevOps and infrastructure management, including memory capabilities for context retention and reasoning tracking.

## Table of Contents

- [Memory System](#memory-system)
- [Jenkins Tools](#jenkins-tools)
- [Ansible Tools](#ansible-tools)
- [Terraform Tools](#terraform-tools)
- [Kubernetes Tools](#kubernetes-tools)
- [Docker Tools](#docker-tools)
- [Resources](#resources)
- [Prompts](#prompts)

## Memory System

The server includes a sophisticated memory system for storing context, tracking reasoning, and maintaining state across interactions.

### Memory Tools

#### `memory_store`
Store key-value pairs with optional tags and categories.

**Parameters:**
- `key` (string): The key to store
- `value` (any): The value to store
- `tags` (array of strings, optional): Tags for categorization
- `category` (string, optional): Category (jenkins, ansible, terraform, kubernetes, docker)

**Example:**
```json
{
  "key": "prod_vpc_id",
  "value": "vpc-12345",
  "tags": ["production", "networking"],
  "category": "terraform"
}
```

#### `memory_recall`
Retrieve stored values by key or get all memory contents.

**Parameters:**
- `key` (string, optional): The key to recall (omit for all memory)

#### `memory_delete`
Delete a key from memory.

**Parameters:**
- `key` (string): The key to delete

#### `memory_search`
Search memory by query string and optional category.

**Parameters:**
- `query` (string): Search query
- `category` (string, optional): Category to filter by

#### `add_reasoning`
Record a reasoning step with context and decision.

**Parameters:**
- `context` (string): The context or problem being considered
- `decision` (string): The decision or conclusion reached

#### `get_reasoning_history`
Retrieve recent reasoning history.

**Parameters:**
- `limit` (number, default: 10): Number of recent entries to retrieve

## Jenkins Tools

### `validate_jenkinsfile`
Validate a Jenkinsfile for syntax and common issues.

**Parameters:**
- `content` (string): The Jenkinsfile content to validate

**Checks:**
- Pipeline structure (pipeline block, agent, stages)
- Syntax consistency (declarative vs scripted)
- Security issues (hardcoded credentials)

### `generate_jenkinsfile`
Generate a Jenkinsfile template based on project requirements.

**Parameters:**
- `projectType` (enum): nodejs, python, java, docker, terraform
- `stages` (array of strings): Pipeline stages (e.g., build, test, deploy)
- `agent` (string, default: "any"): Agent to run on

**Example:**
```json
{
  "projectType": "nodejs",
  "stages": ["build", "test", "deploy"],
  "agent": "docker"
}
```

### `analyze_jenkins_pipeline`
Analyze a Jenkins pipeline for optimization opportunities.

**Parameters:**
- `content` (string): The Jenkinsfile content to analyze

**Provides:**
- Stage count and complexity metrics
- Parallel execution opportunities
- Security recommendations
- Best practices compliance

## Ansible Tools

### `validate_ansible_playbook`
Validate an Ansible playbook for syntax and best practices.

**Parameters:**
- `content` (string): The playbook YAML content to validate

**Checks:**
- YAML structure (hosts, tasks, roles)
- Best practices (task names, privilege escalation)
- Security (vault usage, plaintext passwords)

### `generate_ansible_playbook`
Generate an Ansible playbook template.

**Parameters:**
- `playbookType` (enum): webserver, database, docker, kubernetes, security_hardening, user_management
- `hosts` (string): Target hosts or group
- `variables` (object, optional): Variables to include

**Example:**
```json
{
  "playbookType": "webserver",
  "hosts": "web_servers",
  "variables": {
    "nginx_port": "80",
    "ssl_enabled": "true"
  }
}
```

### `lint_ansible_playbook`
Check Ansible playbook for anti-patterns and style issues.

**Parameters:**
- `content` (string): The playbook content to lint

**Detects:**
- Deprecated modules
- Missing changed_when clauses
- Sensitive data without no_log
- Package management best practices

### `generate_ansible_inventory`
Generate an Ansible inventory file.

**Parameters:**
- `format` (enum): ini, yaml
- `groups` (object): Host groups and their hosts
- `variables` (object, optional): Group variables

## Terraform Tools

### `validate_terraform`
Validate Terraform configuration files.

**Parameters:**
- `content` (string): The Terraform configuration content

**Checks:**
- Basic structure (terraform, resource, data blocks)
- Best practices (required_version, backend, tags)
- Security (hardcoded credentials, access keys)

### `generate_terraform_module`
Generate a Terraform module template.

**Parameters:**
- `moduleType` (enum): vpc, ec2, rds, s3, lambda, eks, iam, security_group
- `provider` (enum): aws, azure, gcp
- `includeVariables` (boolean, default: true): Include variables.tf
- `includeOutputs` (boolean, default: true): Include outputs.tf

**Example:**
```json
{
  "moduleType": "vpc",
  "provider": "aws",
  "includeVariables": true,
  "includeOutputs": true
}
```

### `format_terraform`
Format Terraform configuration to canonical style.

**Parameters:**
- `content` (string): The Terraform content to format

### `analyze_terraform_state`
Analyze Terraform state for insights.

**Parameters:**
- `stateContent` (string): The Terraform state JSON content

**Provides:**
- Resource count and types
- Module structure
- Provider information
- Recommendations

### `generate_terraform_backend`
Generate backend configuration for state management.

**Parameters:**
- `backendType` (enum): s3, azurerm, gcs, consul, kubernetes
- `config` (object): Backend configuration parameters

## Kubernetes Tools

### `validate_k8s_manifest`
Validate Kubernetes manifest for syntax and best practices.

**Parameters:**
- `content` (string): The Kubernetes manifest YAML content

**Checks:**
- Required fields (apiVersion, kind, metadata)
- Resource configurations (replicas, strategy)
- Security (privileged containers, host network)
- Image tags and pull policies
- Health checks

### `generate_k8s_manifest`
Generate a Kubernetes manifest template.

**Parameters:**
- `resourceType` (enum): deployment, service, configmap, secret, ingress, statefulset, daemonset, job, cronjob
- `name` (string): Resource name
- `namespace` (string, default: "default"): Namespace
- `options` (object, optional): Additional options

**Example:**
```json
{
  "resourceType": "deployment",
  "name": "my-app",
  "namespace": "production",
  "options": {
    "replicas": 3,
    "image": "myapp:v1.0.0",
    "port": 8080
  }
}
```

### `generate_helm_chart`
Generate a Helm chart structure.

**Parameters:**
- `chartName` (string): Name of the Helm chart
- `appVersion` (string, default: "1.0.0"): Application version
- `description` (string): Chart description

**Generates:**
- Chart.yaml
- values.yaml
- templates/deployment.yaml
- templates/_helpers.tpl

### `analyze_k8s_resources`
Analyze Kubernetes resources for optimization opportunities.

**Parameters:**
- `manifests` (array of strings): Array of Kubernetes manifest contents

**Provides:**
- Resource counts and types
- Missing resources analysis
- Security issues
- Optimization recommendations

### `generate_kustomization`
Generate a Kustomization file.

**Parameters:**
- `resources` (array of strings): List of resource files
- `namespace` (string, optional): Target namespace
- `namePrefix` (string, optional): Name prefix for resources
- `commonLabels` (object, optional): Common labels

## Docker Tools

### `validate_dockerfile`
Validate a Dockerfile for syntax and best practices.

**Parameters:**
- `content` (string): The Dockerfile content to validate

**Checks:**
- Basic structure (FROM instruction)
- Security (USER instruction, secrets)
- Layer optimization (RUN command consolidation)
- Best practices (HEALTHCHECK, apt cache cleanup)

### `generate_dockerfile`
Generate a Dockerfile template.

**Parameters:**
- `projectType` (enum): nodejs, python, java, go, rust, ruby, php, dotnet
- `includeMultiStage` (boolean, default: true): Use multi-stage build
- `baseImage` (string, optional): Custom base image

**Example:**
```json
{
  "projectType": "nodejs",
  "includeMultiStage": true,
  "baseImage": "node:18-alpine"
}
```

### `generate_docker_compose`
Generate a docker-compose.yml file.

**Parameters:**
- `services` (array of objects): Services to include
  - `name` (string): Service name
  - `type` (enum): app, database, cache, queue, custom
  - `ports` (array of strings, optional): Port mappings
  - `environment` (object, optional): Environment variables
- `version` (string, default: "3.8"): Docker Compose file format version

**Example:**
```json
{
  "services": [
    {
      "name": "web",
      "type": "app",
      "ports": ["3000:3000"],
      "environment": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "db",
      "type": "database"
    }
  ]
}
```

### `optimize_dockerfile`
Suggest optimizations for a Dockerfile.

**Parameters:**
- `content` (string): The Dockerfile content to optimize

**Provides:**
- Layer optimization suggestions
- Cache optimization recommendations
- Size reduction opportunities
- Estimated size reduction

### `analyze_docker_image`
Analyze a Docker image structure.

**Parameters:**
- `imageLayers` (array of strings): Image layers information
- `totalSize` (number, optional): Total image size in MB

## Resources

### `devops_best_practices`
URI: `clp://devops/best-practices`

Comprehensive guide to DevOps best practices covering:
- CI/CD Pipeline best practices
- Infrastructure as Code guidelines
- Container best practices
- Kubernetes best practices
- Security considerations

### `jenkins_pipeline_examples`
URI: `clp://jenkins/examples`

Collection of Jenkins pipeline examples including:
- Basic declarative pipelines
- Multi-stage pipelines
- Docker-based pipelines

### `terraform_modules`
URI: `clp://terraform/modules`

Common Terraform module patterns and best practices.

## Prompts

### `infrastructure_audit`
Generate a comprehensive infrastructure audit checklist.

**Parameters:**
- `infrastructure_type` (string): Type of infrastructure (jenkins, ansible, terraform, kubernetes, docker)

### `deployment_strategy`
Create a deployment strategy recommendation.

**Parameters:**
- `application_type` (string): Type of application
- `environment` (string): Target environment (dev, staging, production)

## Usage Examples

### Example 1: Store and Recall Infrastructure Information

```javascript
// Store VPC information
memory_store({
  key: "prod_vpc",
  value: {
    vpc_id: "vpc-12345",
    cidr: "10.0.0.0/16",
    region: "us-east-1"
  },
  tags: ["production", "networking"],
  category: "terraform"
});

// Recall it later
memory_recall({ key: "prod_vpc" });

// Search for production resources
memory_search({ query: "production", category: "terraform" });
```

### Example 2: Generate and Validate Jenkins Pipeline

```javascript
// Generate a Jenkins pipeline
generate_jenkinsfile({
  projectType: "nodejs",
  stages: ["build", "test", "deploy"],
  agent: "docker"
});

// Validate the generated pipeline
validate_jenkinsfile({
  content: "pipeline { ... }"
});

// Analyze for optimization
analyze_jenkins_pipeline({
  content: "pipeline { ... }"
});
```

### Example 3: Create Kubernetes Deployment

```javascript
// Generate Kubernetes deployment
generate_k8s_manifest({
  resourceType: "deployment",
  name: "my-app",
  namespace: "production",
  options: {
    replicas: 3,
    image: "myapp:v1.0.0",
    port: 8080
  }
});

// Validate the manifest
validate_k8s_manifest({
  content: "apiVersion: apps/v1\nkind: Deployment\n..."
});
```

### Example 4: Docker Workflow

```javascript
// Generate a Dockerfile
generate_dockerfile({
  projectType: "nodejs",
  includeMultiStage: true
});

// Validate it
validate_dockerfile({
  content: "FROM node:18-alpine\n..."
});

// Get optimization suggestions
optimize_dockerfile({
  content: "FROM node:18-alpine\n..."
});

// Generate docker-compose for the stack
generate_docker_compose({
  services: [
    { name: "app", type: "app", ports: ["3000:3000"] },
    { name: "db", type: "database" },
    { name: "cache", type: "cache" }
  ]
});
```

### Example 5: Track Reasoning

```javascript
// Record decision-making process
add_reasoning({
  context: "Need to decide between ECS and EKS for container orchestration",
  decision: "Selected EKS due to portability requirements and existing Kubernetes knowledge"
});

add_reasoning({
  context: "Choosing deployment strategy for production",
  decision: "Implementing blue-green deployment with Route53 weighted routing"
});

// Review reasoning history
get_reasoning_history({ limit: 10 });
```

## Best Practices

1. **Use Memory System**: Store important infrastructure IDs, configurations, and decisions for reference
2. **Track Reasoning**: Document why decisions were made for future reference
3. **Validate Everything**: Always validate configurations before applying them
4. **Tag Appropriately**: Use consistent tagging in memory for easy retrieval
5. **Categorize**: Use categories to organize different types of infrastructure
6. **Multi-stage Builds**: Prefer multi-stage Dockerfiles for smaller images
7. **Resource Limits**: Always set resource limits in Kubernetes
8. **Version Everything**: Pin versions in all configurations
9. **Security First**: Never commit secrets, always use secrets management
10. **Document**: Use the memory system to document configurations and decisions
