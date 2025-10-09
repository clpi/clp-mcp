# DevOps Tools and Resources

This MCP server provides comprehensive DevOps tools, resources, and prompts covering the full spectrum of infrastructure, CI/CD, and cloud operations scenarios.

## Overview

The server includes support for:
- **Ansible**: Playbook analysis, role generation, and inventory management
- **Jenkins**: Pipeline analysis, generation, and best practices
- **Kubernetes**: Manifest analysis, resource generation, security scanning, and Helm charts
- **Cloud Services**: AWS, Azure, GCP infrastructure management and best practices
- **Repository Context**: History tracking, file changes, and knowledge management
- **Infrastructure as Code**: Terraform best practices and patterns

## Tools

### Ansible Tools

#### `ansible_analyze_inventory`
Analyze Ansible inventory files to understand host groups, variables, and configurations.

**Parameters:**
- `inventoryPath` (string): Path to Ansible inventory file (INI or YAML format)
- `includeVars` (boolean, default: true): Include host and group variables in analysis

**Example:**
```json
{
  "inventoryPath": "/path/to/inventory.ini",
  "includeVars": true
}
```

#### `ansible_analyze_playbook`
Analyze Ansible playbooks to understand tasks, roles, and dependencies.

**Parameters:**
- `playbookPath` (string): Path to Ansible playbook YAML file
- `checkSyntax` (boolean, default: true): Perform syntax validation
- `analyzeRoles` (boolean, default: true): Analyze referenced roles

#### `ansible_generate_role`
Generate Ansible role structure with tasks, handlers, and templates.

**Parameters:**
- `roleName` (string): Name of the role to generate
- `includeTasks` (array, optional): List of task types to include
- `targetOS` (enum, optional): Target operating system

#### `ansible_vault_info`
Get information about Ansible Vault encrypted files and best practices.

**Parameters:**
- `vaultFile` (string, optional): Path to vault file to analyze
- `operation` (enum): Type of vault information needed (info, best-practices, rotation-guide)

#### `ansible_module_lookup`
Look up Ansible module documentation and usage examples.

**Parameters:**
- `moduleName` (string): Name of the Ansible module
- `includeExamples` (boolean, default: true): Include usage examples

### Jenkins Tools

#### `jenkins_analyze_pipeline`
Analyze Jenkinsfile to understand pipeline stages, steps, and dependencies.

**Parameters:**
- `jenkinsfilePath` (string): Path to Jenkinsfile
- `pipelineType` (enum, default: auto-detect): Type of Jenkins pipeline
- `analyzePlugins` (boolean, default: true): Analyze required Jenkins plugins

#### `jenkins_generate_pipeline`
Generate Jenkinsfile for common CI/CD scenarios.

**Parameters:**
- `pipelineType` (enum, default: declarative): Type of pipeline to generate
- `language` (enum): Programming language/framework
- `stages` (array): Pipeline stages to include
- `deploymentTarget` (enum, optional): Deployment target

#### `jenkins_plugin_lookup`
Look up Jenkins plugin information and configuration.

**Parameters:**
- `pluginName` (string): Name of the Jenkins plugin
- `includeConfig` (boolean, default: true): Include configuration examples

#### `jenkins_credential_management`
Best practices and patterns for Jenkins credential management.

**Parameters:**
- `credentialType` (enum): Type of credential
- `operation` (enum): Type of information needed

#### `jenkins_shared_library`
Manage and analyze Jenkins shared libraries.

**Parameters:**
- `libraryName` (string): Name of the shared library
- `operation` (enum): Operation to perform (structure, create, usage-example)

### Kubernetes Tools

#### `k8s_analyze_manifest`
Analyze Kubernetes manifests for best practices, security, and resource optimization.

**Parameters:**
- `manifestPath` (string): Path to Kubernetes manifest file (YAML)
- `checkSecurity` (boolean, default: true): Perform security analysis
- `validateSchema` (boolean, default: true): Validate against Kubernetes API schema

#### `k8s_generate_resource`
Generate Kubernetes resource manifests (Deployment, Service, ConfigMap, etc.).

**Parameters:**
- `resourceType` (enum): Type of Kubernetes resource
- `name` (string): Name of the resource
- `namespace` (string, default: default): Kubernetes namespace
- `containerImage` (string, optional): Container image
- `replicas` (number, optional): Number of replicas

#### `k8s_analyze_helm_chart`
Analyze Helm charts for structure, dependencies, and best practices.

**Parameters:**
- `chartPath` (string): Path to Helm chart directory
- `validateValues` (boolean, default: true): Validate values.yaml schema
- `checkDependencies` (boolean, default: true): Check chart dependencies

#### `k8s_security_scan`
Scan Kubernetes resources for security vulnerabilities and misconfigurations.

**Parameters:**
- `resourcePath` (string): Path to Kubernetes resource or directory
- `scanType` (enum, default: all): Type of security scan
- `severity` (enum, optional): Minimum severity level to report

#### `k8s_resource_quota`
Analyze and recommend resource quotas and limits for Kubernetes workloads.

**Parameters:**
- `workloadPath` (string): Path to workload manifest
- `recommendLimits` (boolean, default: true): Recommend resource limits and requests
- `analyzeCurrentUsage` (boolean, default: false): Analyze current resource usage patterns

#### `k8s_network_policy`
Generate and analyze Kubernetes network policies.

**Parameters:**
- `operation` (enum): Operation to perform (generate, analyze, validate)
- `policyPath` (string, optional): Path to network policy
- `targetPods` (string, optional): Label selector for target pods

### Cloud Tools

#### `cloud_analyze_infrastructure`
Analyze cloud infrastructure configurations (Terraform, CloudFormation, ARM templates).

**Parameters:**
- `configPath` (string): Path to infrastructure configuration file
- `provider` (enum): Cloud provider (aws, azure, gcp, multi-cloud)
- `configType` (enum): Infrastructure as Code tool
- `checkCosts` (boolean, default: true): Estimate infrastructure costs

#### `cloud_security_audit`
Audit cloud resources for security best practices and compliance.

**Parameters:**
- `provider` (enum): Cloud provider
- `resourceType` (enum, default: all): Resource type to audit
- `complianceFramework` (enum, optional): Compliance framework to check against

#### `cloud_cost_optimization`
Analyze cloud spending and provide cost optimization recommendations.

**Parameters:**
- `provider` (enum): Cloud provider
- `analysisScope` (enum, default: all): Scope of cost analysis
- `recommendationLevel` (enum, default: moderate): Level of recommendations

#### `cloud_migration_planner`
Plan and assess cloud migration strategies.

**Parameters:**
- `sourceEnvironment` (enum): Source environment
- `targetProvider` (enum): Target cloud provider
- `workloadType` (enum): Type of workload to migrate
- `migrationStrategy` (enum, optional): Preferred migration strategy

#### `cloud_best_practices`
Look up cloud provider best practices and patterns.

**Parameters:**
- `provider` (enum): Cloud provider
- `topic` (enum): Best practice topic
- `serviceType` (string, optional): Specific service

#### `cloud_disaster_recovery`
Design and analyze disaster recovery strategies for cloud workloads.

**Parameters:**
- `provider` (enum): Cloud provider
- `rto` (number, optional): Recovery Time Objective in hours
- `rpo` (number, optional): Recovery Point Objective in hours
- `criticalityLevel` (enum): Workload criticality

### Repository Tools

#### `repo_analyze_history`
Analyze repository commit history, changes, and patterns.

**Parameters:**
- `repoPath` (string): Path to git repository
- `timeRange` (enum, default: last-month): Time range for analysis
- `analysisType` (enum, default: all): Type of analysis

#### `repo_track_files`
Track file changes, history, and evolution in repository.

**Parameters:**
- `repoPath` (string): Path to git repository
- `filePath` (string, optional): Specific file to track
- `includeContent` (boolean, default: false): Include file content in tracking

#### `repo_context_memory`
Store and retrieve repository context, decisions, and knowledge.

**Parameters:**
- `operation` (enum): Memory operation (store, retrieve, search, list)
- `context` (string, optional): Context to store
- `query` (string, optional): Search query
- `category` (enum, optional): Category of context

#### `repo_track_dependencies`
Track and analyze repository dependencies across package managers.

**Parameters:**
- `repoPath` (string): Path to repository
- `packageManager` (enum, default: all): Package manager to analyze
- `checkVulnerabilities` (boolean, default: true): Check for known vulnerabilities

#### `repo_map_infrastructure`
Map all infrastructure and DevOps files in repository.

**Parameters:**
- `repoPath` (string): Path to repository
- `includeTypes` (array, default: all): Types of infrastructure to map

#### `repo_knowledge_graph`
Build knowledge graph of repository structure, relationships, and dependencies.

**Parameters:**
- `repoPath` (string): Path to repository
- `depth` (enum, default: medium): Depth of knowledge graph analysis
- `includeExternal` (boolean, default: false): Include external dependencies in graph

**Returns:**
Provides a structured analysis and recommendations for building a queryable knowledge graph using the entity and relationship tools.

**Integration:**
This tool works in conjunction with the knowledge graph system:
- Creates entities for repository components (services, configs, infrastructure)
- Establishes relationships (dependencies, configurations, deployments)
- Enables semantic queries and impact analysis
- Supports visualization through graph export

**Workflow:**
1. Run `repo_knowledge_graph` to analyze repository structure
2. Use `add_entity` to create entities for discovered components
3. Use `add_relationship` to model dependencies and connections
4. Query using `query_entities`, `query_relationships`, `traverse_graph`
5. Export using `export_graph` for visualization

## Resources

The server provides extensive knowledge resources accessible via URI:

### Ansible Resources
- `devops://ansible/best-practices` - Ansible best practices guide
- `devops://ansible/modules` - Common Ansible modules reference
- `devops://ansible/playbook-patterns` - Ansible playbook patterns

### Jenkins Resources
- `devops://jenkins/pipeline-best-practices` - Jenkins pipeline best practices
- `devops://jenkins/shared-libraries` - Jenkins shared libraries guide
- `devops://jenkins/essential-plugins` - Essential Jenkins plugins

### Kubernetes Resources
- `devops://kubernetes/best-practices` - Kubernetes best practices
- `devops://kubernetes/manifest-patterns` - Kubernetes manifest patterns
- `devops://kubernetes/security` - Kubernetes security best practices
- `devops://kubernetes/helm` - Helm best practices

### Cloud Resources
- `devops://cloud/aws-best-practices` - AWS Well-Architected Framework
- `devops://cloud/azure-best-practices` - Azure best practices
- `devops://cloud/gcp-best-practices` - GCP best practices
- `devops://cloud/terraform-best-practices` - Terraform best practices

## Prompts

The server provides intelligent prompts for common DevOps scenarios:

### `infra_provision`
Generate infrastructure provisioning plan.

**Parameters:**
- `environment` (enum): Target environment (dev, staging, production)
- `platform` (enum): Target platform (aws, azure, gcp, on-premise)
- `components` (array): Infrastructure components needed

### `cicd_pipeline`
Generate CI/CD pipeline configuration.

**Parameters:**
- `pipelineTool` (enum): CI/CD tool (jenkins, github-actions, gitlab-ci, azure-devops)
- `language` (enum): Application language/framework
- `deploymentTarget` (enum): Deployment target (kubernetes, docker, vm, serverless)

### `k8s_deployment`
Generate Kubernetes deployment configuration.

**Parameters:**
- `appName` (string): Application name
- `containerImage` (string): Container image
- `replicas` (number, default: 3): Number of replicas
- `exposeService` (boolean, default: true): Create service to expose the application

### `ansible_playbook`
Generate Ansible playbook for common tasks.

**Parameters:**
- `task` (enum): Type of task
- `targetOS` (enum): Target operating system
- `includeRoles` (boolean, default: true): Use roles for organization

### `cloud_migration`
Generate cloud migration strategy and plan.

**Parameters:**
- `source` (enum): Source environment
- `target` (enum): Target cloud provider
- `workloadType` (enum): Type of workload

### `disaster_recovery`
Generate disaster recovery plan.

**Parameters:**
- `platform` (enum): Platform
- `rto` (number): Recovery Time Objective in hours
- `rpo` (number): Recovery Point Objective in hours
- `criticality` (enum): Workload criticality

### `security_audit`
Generate security audit checklist and recommendations.

**Parameters:**
- `scope` (enum): Audit scope (kubernetes, cloud-infrastructure, ansible, ci-cd)
- `complianceFramework` (enum, optional): Compliance framework

## Use Cases

### 1. Infrastructure Provisioning
Use the `infra_provision` prompt to generate complete infrastructure plans, then use cloud tools to implement and analyze the configuration.

### 2. CI/CD Pipeline Setup
Generate pipeline configurations with the `cicd_pipeline` prompt, then use Jenkins or other CI/CD tools to analyze and optimize.

### 3. Kubernetes Deployment
Create deployment manifests with `k8s_deployment` prompt, then use Kubernetes tools to validate security and optimize resources.

### 4. Cloud Migration
Plan migrations with `cloud_migration` prompt, analyze infrastructure with cloud tools, and track progress with repository tools.

### 5. Security Auditing
Generate audit checklists with `security_audit` prompt, then use security scanning tools to identify vulnerabilities.

### 6. Repository Knowledge Management
Use repository tools to track changes, build knowledge graphs, and maintain context across your DevOps infrastructure.

## Integration Examples

### With Claude or Other AI Assistants

```
Use the cloud_analyze_infrastructure tool to review my Terraform configuration,
then provide recommendations based on the aws-best-practices resource.
```

```
Generate a Kubernetes deployment using the k8s_deployment prompt, 
then analyze it with k8s_security_scan to ensure it's production-ready.
```

```
Help me create an Ansible playbook for web server setup using the 
ansible_playbook prompt, referencing the ansible-best-practices resource.
```

## Best Practices

1. **Start with Prompts**: Use prompts to generate initial configurations
2. **Analyze with Tools**: Use analysis tools to validate and optimize
3. **Reference Resources**: Consult knowledge resources for best practices
4. **Track in Repository**: Use repository tools to maintain context and history
5. **Iterate**: Use the feedback loop between prompts, tools, and resources

## Contributing

To add new DevOps tools or resources:

1. Add tool definitions in `src/tool/devops/`
2. Add resource content in `src/resource/devops/`
3. Add prompts in `src/prompt/devops.ts`
4. Register in `src/server/index.ts`
5. Update this documentation

## Support

For issues or questions, please refer to the main repository README or open an issue on GitHub.
