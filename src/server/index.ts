import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import console from "node:console"
import process from "node:process"
import { } from "@smithery/sdk"
import {z} from "zod"
import { ClpMcpServer } from "../server.js"
import { jenkinsTools } from "../tool/jenkins.js"
import { ansibleTools } from "../tool/ansible.js"
import { terraformTools } from "../tool/terraform.js"
import { kubernetesTools } from "../tool/kubernetes.js"
import { dockerTools } from "../tool/docker.js"

export class ClpMcp {
  readonly name: string = "clp-mcp"
  readonly version: string = "0.0.1"
  readonly title: string = "CLP MCP"
  readonly description: string = "DevOps-focused MCP server with memory and infrastructure tooling"
  readonly websiteUrl: string = "pecunies.com"
}

export const configSchema = z.object({
  debug: z.boolean().default(false),
})

export default function serve({ config, }: { config: z.infer<typeof configSchema>; } ) {
  // If you want to support SSE, you can check for the --sse flag
  // and set up your server accordingly 
  if (config.debug) {
    console.log("Debug mode is enabled.");
  }
  if (process.argv.includes("--sse")) {
    console.log("SSE mode is not supported yet.");
  }

  const mcp = new McpServer({
    name: "clp-mcp",
    version: "0.0.1",
    title: "CLP MCP - DevOps Infrastructure Server",
    description: "DevOps-focused MCP server with memory and comprehensive infrastructure tooling",
    websiteUrl: "pecunies.com",
  });

  // Initialize memory system
  const memory = new ClpMcpServer();

  // Memory Tools
  mcp.registerTool(
    "memory_store",
    {
      title: "Store in Memory",
      description: "Store a key-value pair in memory with optional tags and category",
      inputSchema: {
        key: z.string().describe("The key to store"),
        value: z.any().describe("The value to store"),
        tags: z.array(z.string()).optional().describe("Tags for categorization"),
        category: z.string().optional().describe("Category (e.g., jenkins, ansible, terraform, kubernetes, docker)"),
      },
    },
    ({ key, value, tags, category }: { key: string; value: any; tags?: string[]; category?: string }) => 
      memory.store(key, value, tags, category)
  );

  mcp.registerTool(
    "memory_recall",
    {
      title: "Recall from Memory",
      description: "Recall a specific key or all memory contents",
      inputSchema: {
        key: z.string().optional().describe("The key to recall (omit for all memory)"),
      },
    },
    ({ key }: { key?: string }) => memory.recall(key)
  );

  mcp.registerTool(
    "memory_delete",
    {
      title: "Delete from Memory",
      description: "Delete a key from memory",
      inputSchema: {
        key: z.string().describe("The key to delete"),
      },
    },
    ({ key }: { key: string }) => memory.delete(key)
  );

  mcp.registerTool(
    "memory_search",
    {
      title: "Search Memory",
      description: "Search memory by query string and optional category",
      inputSchema: {
        query: z.string().describe("Search query"),
        category: z.string().optional().describe("Category to filter by"),
      },
    },
    ({ query, category }: { query: string; category?: string }) => 
      memory.search(query, category)
  );

  mcp.registerTool(
    "add_reasoning",
    {
      title: "Add Reasoning",
      description: "Record a reasoning step with context and decision",
      inputSchema: {
        context: z.string().describe("The context or problem being considered"),
        decision: z.string().describe("The decision or conclusion reached"),
      },
    },
    ({ context, decision }: { context: string; decision: string }) => {
      memory.addReasoning(context, decision);
      return {
        content: [{ type: "text" as const, text: "Reasoning recorded" }]
      };
    }
  );

  mcp.registerTool(
    "get_reasoning_history",
    {
      title: "Get Reasoning History",
      description: "Retrieve recent reasoning history",
      inputSchema: {
        limit: z.number().default(10).describe("Number of recent entries to retrieve"),
      },
    },
    ({ limit }: { limit: number }) => memory.getReasoningHistory(limit)
  );

  // Jenkins Tools
  mcp.registerTool(
    jenkinsTools.validateJenkinsfile.name,
    {
      title: jenkinsTools.validateJenkinsfile.title,
      description: jenkinsTools.validateJenkinsfile.description,
      inputSchema: jenkinsTools.validateJenkinsfile.inputSchema.shape,
    },
    jenkinsTools.validateJenkinsfile.handler
  );

  mcp.registerTool(
    jenkinsTools.generateJenkinsfile.name,
    {
      title: jenkinsTools.generateJenkinsfile.title,
      description: jenkinsTools.generateJenkinsfile.description,
      inputSchema: jenkinsTools.generateJenkinsfile.inputSchema.shape,
    },
    jenkinsTools.generateJenkinsfile.handler
  );

  mcp.registerTool(
    jenkinsTools.analyzeJenkinsPipeline.name,
    {
      title: jenkinsTools.analyzeJenkinsPipeline.title,
      description: jenkinsTools.analyzeJenkinsPipeline.description,
      inputSchema: jenkinsTools.analyzeJenkinsPipeline.inputSchema.shape,
    },
    jenkinsTools.analyzeJenkinsPipeline.handler
  );

  // Ansible Tools
  mcp.registerTool(
    ansibleTools.validatePlaybook.name,
    {
      title: ansibleTools.validatePlaybook.title,
      description: ansibleTools.validatePlaybook.description,
      inputSchema: ansibleTools.validatePlaybook.inputSchema.shape,
    },
    ansibleTools.validatePlaybook.handler
  );

  mcp.registerTool(
    ansibleTools.generatePlaybook.name,
    {
      title: ansibleTools.generatePlaybook.title,
      description: ansibleTools.generatePlaybook.description,
      inputSchema: ansibleTools.generatePlaybook.inputSchema.shape,
    },
    ansibleTools.generatePlaybook.handler
  );

  mcp.registerTool(
    ansibleTools.lintPlaybook.name,
    {
      title: ansibleTools.lintPlaybook.title,
      description: ansibleTools.lintPlaybook.description,
      inputSchema: ansibleTools.lintPlaybook.inputSchema.shape,
    },
    ansibleTools.lintPlaybook.handler
  );

  mcp.registerTool(
    ansibleTools.generateInventory.name,
    {
      title: ansibleTools.generateInventory.title,
      description: ansibleTools.generateInventory.description,
      inputSchema: ansibleTools.generateInventory.inputSchema.shape,
    },
    ansibleTools.generateInventory.handler
  );

  // Terraform Tools
  mcp.registerTool(
    terraformTools.validateTerraform.name,
    {
      title: terraformTools.validateTerraform.title,
      description: terraformTools.validateTerraform.description,
      inputSchema: terraformTools.validateTerraform.inputSchema.shape,
    },
    terraformTools.validateTerraform.handler
  );

  mcp.registerTool(
    terraformTools.generateTerraformModule.name,
    {
      title: terraformTools.generateTerraformModule.title,
      description: terraformTools.generateTerraformModule.description,
      inputSchema: terraformTools.generateTerraformModule.inputSchema.shape,
    },
    terraformTools.generateTerraformModule.handler
  );

  mcp.registerTool(
    terraformTools.formatTerraform.name,
    {
      title: terraformTools.formatTerraform.title,
      description: terraformTools.formatTerraform.description,
      inputSchema: terraformTools.formatTerraform.inputSchema.shape,
    },
    terraformTools.formatTerraform.handler
  );

  mcp.registerTool(
    terraformTools.analyzeTerraformState.name,
    {
      title: terraformTools.analyzeTerraformState.title,
      description: terraformTools.analyzeTerraformState.description,
      inputSchema: terraformTools.analyzeTerraformState.inputSchema.shape,
    },
    terraformTools.analyzeTerraformState.handler
  );

  mcp.registerTool(
    terraformTools.generateTerraformBackend.name,
    {
      title: terraformTools.generateTerraformBackend.title,
      description: terraformTools.generateTerraformBackend.description,
      inputSchema: terraformTools.generateTerraformBackend.inputSchema.shape,
    },
    terraformTools.generateTerraformBackend.handler
  );

  // Kubernetes Tools
  mcp.registerTool(
    kubernetesTools.validateK8sManifest.name,
    {
      title: kubernetesTools.validateK8sManifest.title,
      description: kubernetesTools.validateK8sManifest.description,
      inputSchema: kubernetesTools.validateK8sManifest.inputSchema.shape,
    },
    kubernetesTools.validateK8sManifest.handler
  );

  mcp.registerTool(
    kubernetesTools.generateK8sManifest.name,
    {
      title: kubernetesTools.generateK8sManifest.title,
      description: kubernetesTools.generateK8sManifest.description,
      inputSchema: kubernetesTools.generateK8sManifest.inputSchema.shape,
    },
    kubernetesTools.generateK8sManifest.handler
  );

  mcp.registerTool(
    kubernetesTools.generateHelm.name,
    {
      title: kubernetesTools.generateHelm.title,
      description: kubernetesTools.generateHelm.description,
      inputSchema: kubernetesTools.generateHelm.inputSchema.shape,
    },
    kubernetesTools.generateHelm.handler
  );

  mcp.registerTool(
    kubernetesTools.analyzeK8sResources.name,
    {
      title: kubernetesTools.analyzeK8sResources.title,
      description: kubernetesTools.analyzeK8sResources.description,
      inputSchema: kubernetesTools.analyzeK8sResources.inputSchema.shape,
    },
    kubernetesTools.analyzeK8sResources.handler
  );

  mcp.registerTool(
    kubernetesTools.generateKustomization.name,
    {
      title: kubernetesTools.generateKustomization.title,
      description: kubernetesTools.generateKustomization.description,
      inputSchema: kubernetesTools.generateKustomization.inputSchema.shape,
    },
    kubernetesTools.generateKustomization.handler
  );

  // Docker Tools
  mcp.registerTool(
    dockerTools.validateDockerfile.name,
    {
      title: dockerTools.validateDockerfile.title,
      description: dockerTools.validateDockerfile.description,
      inputSchema: dockerTools.validateDockerfile.inputSchema.shape,
    },
    dockerTools.validateDockerfile.handler
  );

  mcp.registerTool(
    dockerTools.generateDockerfile.name,
    {
      title: dockerTools.generateDockerfile.title,
      description: dockerTools.generateDockerfile.description,
      inputSchema: dockerTools.generateDockerfile.inputSchema.shape,
    },
    dockerTools.generateDockerfile.handler
  );

  mcp.registerTool(
    dockerTools.generateDockerCompose.name,
    {
      title: dockerTools.generateDockerCompose.title,
      description: dockerTools.generateDockerCompose.description,
      inputSchema: dockerTools.generateDockerCompose.inputSchema.shape,
    },
    dockerTools.generateDockerCompose.handler
  );

  mcp.registerTool(
    dockerTools.optimizeDockerfile.name,
    {
      title: dockerTools.optimizeDockerfile.title,
      description: dockerTools.optimizeDockerfile.description,
      inputSchema: dockerTools.optimizeDockerfile.inputSchema.shape,
    },
    dockerTools.optimizeDockerfile.handler
  );

  mcp.registerTool(
    dockerTools.analyzeDockerImage.name,
    {
      title: dockerTools.analyzeDockerImage.title,
      description: dockerTools.analyzeDockerImage.description,
      inputSchema: dockerTools.analyzeDockerImage.inputSchema.shape,
    },
    dockerTools.analyzeDockerImage.handler
  );
  // Add resources for infrastructure documentation
  mcp.registerResource(
    "devops_best_practices",
    "clp://devops/best-practices",
    {
      title: "DevOps Best Practices",
      description: "Comprehensive guide to DevOps best practices",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: `# DevOps Best Practices

## CI/CD Pipeline
- Use declarative pipelines (Jenkinsfile, GitHub Actions)
- Implement automated testing at every stage
- Use semantic versioning
- Implement proper artifact management
- Enable parallel execution where possible

## Infrastructure as Code
- Version control all infrastructure code
- Use modules/roles for reusability
- Implement proper state management
- Use workspaces for environment isolation
- Document all infrastructure changes

## Container Best Practices
- Use multi-stage builds
- Pin base image versions
- Run as non-root user
- Implement health checks
- Keep images small and secure

## Kubernetes Best Practices
- Set resource limits and requests
- Implement liveness and readiness probes
- Use namespaces for isolation
- Implement RBAC properly
- Use ConfigMaps and Secrets appropriately

## Security
- Never commit secrets to version control
- Use secrets management tools (Vault, AWS Secrets Manager)
- Implement least privilege access
- Regular security scanning
- Keep dependencies updated`,
          mimeType: "text/markdown",
        },
      ],
    }),
  );

  mcp.registerResource(
    "jenkins_pipeline_examples",
    "clp://jenkins/examples",
    {
      title: "Jenkins Pipeline Examples",
      description: "Collection of Jenkins pipeline examples",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: `# Jenkins Pipeline Examples

## Basic Declarative Pipeline
\`\`\`groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
\`\`\`

## Multi-stage with Docker
\`\`\`groovy
pipeline {
    agent {
        docker {
            image 'node:18-alpine'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}
\`\`\``,
          mimeType: "text/markdown",
        },
      ],
    }),
  );

  mcp.registerResource(
    "terraform_modules",
    "clp://terraform/modules",
    {
      title: "Terraform Module Templates",
      description: "Common Terraform module patterns",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: `# Terraform Module Templates

## VPC Module Structure
\`\`\`
modules/vpc/
├── main.tf
├── variables.tf
├── outputs.tf
└── README.md
\`\`\`

## Best Practices
- Use semantic versioning for modules
- Document all variables and outputs
- Include examples in README
- Use data sources where appropriate
- Implement proper tagging strategy`,
          mimeType: "text/markdown",
        },
      ],
    }),
  );

  // Add prompts for infrastructure tasks
  mcp.registerPrompt(
    "infrastructure_audit",
    {
      title: "Infrastructure Audit",
      description: "Generate a comprehensive infrastructure audit checklist",
      argsSchema: {
        infrastructure_type: z.string().describe("Type of infrastructure (jenkins, ansible, terraform, kubernetes, docker)"),
      },
    },
    ({ infrastructure_type }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Generate a comprehensive audit checklist for ${infrastructure_type} infrastructure, including:
1. Security considerations
2. Best practices compliance
3. Performance optimization opportunities
4. Documentation requirements
5. Testing and validation steps`,
            },
          },
        ],
      };
    },
  );

  mcp.registerPrompt(
    "deployment_strategy",
    {
      title: "Deployment Strategy",
      description: "Create a deployment strategy recommendation",
      argsSchema: {
        application_type: z.string().describe("Type of application"),
        environment: z.string().describe("Target environment (dev, staging, production)"),
      },
    },
    ({ application_type, environment }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a detailed deployment strategy for a ${application_type} application to ${environment} environment. Include:
1. Deployment method (rolling, blue-green, canary)
2. Rollback procedures
3. Health checks and monitoring
4. Security considerations
5. Post-deployment verification steps`,
            },
          },
        ],
      };
    },
  );

  return mcp.server;
}
