import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import console from "node:console"
import process from "node:process"
import { } from "@smithery/sdk"
import {z} from "zod"
import { LongTermMemory, MemoryEntrySchema } from "../memory/index.js"

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
    title: "CLP MCP",
    description: "A simple MCP server for CLP with dynamic long-term memory",
    websiteUrl: "pecunies.com",
  });

  // Initialize long-term memory system
  const memory = new LongTermMemory();

  // Add a tool
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

  // Memory Tools
  mcp.registerTool(
    "memory_store",
    {
      title: "Store Memory",
      description: "Store a new memory with optional context, tags, importance, and metadata",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The stored memory details"),
          }),
        ),
      },
      inputSchema: {
        content: z.string().describe("The content to store in memory"),
        context: z.string().optional().describe("Context or category for the memory"),
        tags: z.array(z.string()).optional().describe("Tags for categorization"),
        importance: z.number().min(0).max(1).optional().describe("Importance score (0-1)"),
        metadata: z.record(z.any()).optional().describe("Additional metadata"),
      },
    },
    ({ content, context, tags, importance, metadata }) => {
      const storedMemory = memory.store({
        content,
        context,
        tags,
        importance,
        metadata,
      });
      return {
        content: [
          {
            type: "text",
            text: `Memory stored successfully!\n\nID: ${storedMemory.id}\nContent: ${storedMemory.content}\nContext: ${storedMemory.context || "None"}\nTags: ${storedMemory.tags.join(", ") || "None"}\nImportance: ${storedMemory.importance}\nTimestamp: ${new Date(storedMemory.timestamp).toISOString()}`,
          },
        ],
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
    "memory_recall",
    {
      title: "Recall Memories",
      description: "Recall memories based on various criteria including query, context, tags, importance, and time range",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The recalled memories"),
          }),
        ),
      },
      inputSchema: {
        query: z.string().optional().describe("Search query for full-text search"),
        context: z.string().optional().describe("Filter by context"),
        tags: z.array(z.string()).optional().describe("Filter by tags"),
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
        minImportance: z.number().min(0).max(1).optional().describe("Minimum importance score"),
      },
    },
    ({ query, context, tags, limit, minImportance }) => {
      const memories = memory.recall({
        query,
        context,
        tags,
        limit,
        minImportance,
      });

      if (memories.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No memories found matching the criteria.",
            },
          ],
        };
      }

      const memoriesText = memories
        .map(
          (m, i) =>
            `${i + 1}. [${new Date(m.timestamp).toISOString()}]\n   ID: ${m.id}\n   Content: ${m.content}\n   Context: ${m.context || "None"}\n   Tags: ${m.tags.join(", ") || "None"}\n   Importance: ${m.importance}\n   Access Count: ${m.accessCount}\n   Related: ${m.relatedMemories.length} memories`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${memories.length} memories:\n\n${memoriesText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_search",
    {
      title: "Search Memories",
      description: "Search memories with full-text search",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Search results"),
          }),
        ),
      },
      inputSchema: {
        query: z.string().describe("Search query"),
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
      },
    },
    ({ query, limit }) => {
      const results = memory.search(query, limit);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No memories found for query: "${query}"`,
            },
          ],
        };
      }

      const resultsText = results
        .map(
          (m, i) =>
            `${i + 1}. ${m.content}\n   [${new Date(m.timestamp).toISOString()}] - Importance: ${m.importance}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Search results for "${query}":\n\n${resultsText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_get_recent",
    {
      title: "Get Recent Memories",
      description: "Get the most recent memories",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Recent memories"),
          }),
        ),
      },
      inputSchema: {
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
      },
    },
    ({ limit }) => {
      const recent = memory.getRecent(limit);

      if (recent.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No memories stored yet.",
            },
          ],
        };
      }

      const recentText = recent
        .map(
          (m, i) =>
            `${i + 1}. [${new Date(m.timestamp).toISOString()}] ${m.content.substring(0, 100)}${m.content.length > 100 ? "..." : ""}`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Recent memories:\n\n${recentText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_get_important",
    {
      title: "Get Important Memories",
      description: "Get the most important memories",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Important memories"),
          }),
        ),
      },
      inputSchema: {
        minImportance: z.number().min(0).max(1).optional().describe("Minimum importance (default: 0.7)"),
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
      },
    },
    ({ minImportance, limit }) => {
      const important = memory.getImportant(minImportance, limit);

      if (important.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No important memories found.",
            },
          ],
        };
      }

      const importantText = important
        .map(
          (m, i) =>
            `${i + 1}. [Importance: ${m.importance}] ${m.content}\n   ${new Date(m.timestamp).toISOString()}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Important memories:\n\n${importantText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_stats",
    {
      title: "Memory Statistics",
      description: "Get statistics about the memory system",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Memory statistics"),
          }),
        ),
      },
      inputSchema: {},
    },
    () => {
      const stats = memory.getStats();
      const statsText = [
        "Memory System Statistics:",
        "",
        `Total Memories: ${stats.totalMemories}`,
        `Total Contexts: ${stats.totalContexts}`,
        `Total Tags: ${stats.totalTags}`,
        `Average Importance: ${stats.avgImportance.toFixed(2)}`,
        stats.oldestMemory
          ? `Oldest Memory: ${new Date(stats.oldestMemory).toISOString()}`
          : "Oldest Memory: N/A",
        stats.newestMemory
          ? `Newest Memory: ${new Date(stats.newestMemory).toISOString()}`
          : "Newest Memory: N/A",
      ].join("\n");

      return {
        content: [
          {
            type: "text",
            text: statsText,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_consolidate",
    {
      title: "Consolidate Memories",
      description: "Analyze memories to identify patterns and generate summaries",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Consolidation results"),
          }),
        ),
      },
      inputSchema: {
        context: z.string().optional().describe("Consolidate memories for a specific context"),
      },
    },
    ({ context }) => {
      const result = memory.consolidate(context);

      const patternsText =
        result.patterns.length > 0
          ? result.patterns
              .map((p) => `- ${p.pattern}: ${p.count} memories`)
              .join("\n")
          : "No patterns found";

      const consolidationText = [
        "Memory Consolidation Results:",
        "",
        "Patterns:",
        patternsText,
        "",
        result.summary,
      ].join("\n");

      return {
        content: [
          {
            type: "text",
            text: consolidationText,
          },
        ],
      };
    }
  );
  // Memory Resources
  mcp.registerResource(
    "all_memories",
    "memory://all",
    {
      title: "All Memories",
      description: "Access all stored memories",
    },
    (uri) => {
      const allMemories = memory.export();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(allMemories, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  mcp.registerResource(
    "memory_stats",
    "memory://stats",
    {
      title: "Memory Statistics",
      description: "Current statistics about the memory system",
    },
    (uri) => {
      const stats = memory.getStats();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(stats, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  mcp.registerResource(
    "recent_memories",
    "memory://recent",
    {
      title: "Recent Memories",
      description: "Most recently stored memories",
    },
    (uri) => {
      const recent = memory.getRecent(20);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(recent, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  mcp.registerResource(
    "important_memories",
    "memory://important",
    {
      title: "Important Memories",
      description: "High-importance memories",
    },
    (uri) => {
      const important = memory.getImportant(0.7, 20);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(important, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  // Add a resource
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

  // Register DevOps prompts
  mcp.registerPrompt(
    devopsPrompts.infrastructureProvisioningPrompt.name,
    {
      title: "Infrastructure Provisioning",
      description: devopsPrompts.infrastructureProvisioningPrompt.description,
      argsSchema: devopsPrompts.infrastructureProvisioningPrompt.argsSchema,
    },
    devopsPrompts.handleInfrastructureProvisioning
  );

  mcp.registerPrompt(
    devopsPrompts.cicdPipelinePrompt.name,
    {
      title: "CI/CD Pipeline",
      description: devopsPrompts.cicdPipelinePrompt.description,
      argsSchema: devopsPrompts.cicdPipelinePrompt.argsSchema,
    },
    devopsPrompts.handleCICDPipeline
  );

  mcp.registerPrompt(
    devopsPrompts.kubernetesDeploymentPrompt.name,
    {
      title: "Kubernetes Deployment",
      description: devopsPrompts.kubernetesDeploymentPrompt.description,
      argsSchema: devopsPrompts.kubernetesDeploymentPrompt.argsSchema,
    },
    devopsPrompts.handleKubernetesDeployment
  );

  mcp.registerPrompt(
    devopsPrompts.ansiblePlaybookPrompt.name,
    {
      title: "Ansible Playbook",
      description: devopsPrompts.ansiblePlaybookPrompt.description,
      argsSchema: devopsPrompts.ansiblePlaybookPrompt.argsSchema,
    },
    devopsPrompts.handleAnsiblePlaybook
  );

  mcp.registerPrompt(
    devopsPrompts.cloudMigrationPrompt.name,
    {
      title: "Cloud Migration",
      description: devopsPrompts.cloudMigrationPrompt.description,
      argsSchema: devopsPrompts.cloudMigrationPrompt.argsSchema,
    },
    devopsPrompts.handleCloudMigration
  );

  mcp.registerPrompt(
    devopsPrompts.disasterRecoveryPrompt.name,
    {
      title: "Disaster Recovery",
      description: devopsPrompts.disasterRecoveryPrompt.description,
      argsSchema: devopsPrompts.disasterRecoveryPrompt.argsSchema,
    },
    devopsPrompts.handleDisasterRecovery
  );

  mcp.registerPrompt(
    devopsPrompts.securityAuditPrompt.name,
    {
      title: "Security Audit",
      description: devopsPrompts.securityAuditPrompt.description,
      argsSchema: devopsPrompts.securityAuditPrompt.argsSchema,
    },
    devopsPrompts.handleSecurityAudit
  );

  // Register Ansible tools
  mcp.registerTool(
    ansibleTools.ansibleInventoryAnalysisTool.name,
    {
      title: "Analyze Ansible Inventory",
      description: ansibleTools.ansibleInventoryAnalysisTool.description,
      inputSchema: ansibleTools.ansibleInventoryAnalysisTool.inputSchema,
    },
    ansibleTools.handleAnsibleInventoryAnalysis
  );

  mcp.registerTool(
    ansibleTools.ansiblePlaybookAnalysisTool.name,
    {
      title: "Analyze Ansible Playbook",
      description: ansibleTools.ansiblePlaybookAnalysisTool.description,
      inputSchema: ansibleTools.ansiblePlaybookAnalysisTool.inputSchema,
    },
    ansibleTools.handleAnsiblePlaybookAnalysis
  );

  mcp.registerTool(
    ansibleTools.ansibleRoleGeneratorTool.name,
    {
      title: "Generate Ansible Role",
      description: ansibleTools.ansibleRoleGeneratorTool.description,
      inputSchema: ansibleTools.ansibleRoleGeneratorTool.inputSchema,
    },
    ansibleTools.handleAnsibleRoleGeneration
  );

  mcp.registerTool(
    ansibleTools.ansibleVaultTool.name,
    {
      title: "Ansible Vault Info",
      description: ansibleTools.ansibleVaultTool.description,
      inputSchema: ansibleTools.ansibleVaultTool.inputSchema,
    },
    ansibleTools.handleAnsibleVaultInfo
  );

  mcp.registerTool(
    ansibleTools.ansibleModuleLookupTool.name,
    {
      title: "Ansible Module Lookup",
      description: ansibleTools.ansibleModuleLookupTool.description,
      inputSchema: ansibleTools.ansibleModuleLookupTool.inputSchema,
    },
    ansibleTools.handleAnsibleModuleLookup
  );

  // Register Jenkins tools
  mcp.registerTool(
    jenkinsTools.jenkinsPipelineAnalysisTool.name,
    {
      title: "Analyze Jenkins Pipeline",
      description: jenkinsTools.jenkinsPipelineAnalysisTool.description,
      inputSchema: jenkinsTools.jenkinsPipelineAnalysisTool.inputSchema,
    },
    jenkinsTools.handleJenkinsPipelineAnalysis
  );

  mcp.registerTool(
    jenkinsTools.jenkinsPipelineGeneratorTool.name,
    {
      title: "Generate Jenkins Pipeline",
      description: jenkinsTools.jenkinsPipelineGeneratorTool.description,
      inputSchema: jenkinsTools.jenkinsPipelineGeneratorTool.inputSchema,
    },
    jenkinsTools.handleJenkinsPipelineGeneration
  );

  mcp.registerTool(
    jenkinsTools.jenkinsPluginLookupTool.name,
    {
      title: "Jenkins Plugin Lookup",
      description: jenkinsTools.jenkinsPluginLookupTool.description,
      inputSchema: jenkinsTools.jenkinsPluginLookupTool.inputSchema,
    },
    jenkinsTools.handleJenkinsPluginLookup
  );

  mcp.registerTool(
    jenkinsTools.jenkinsCredentialManagementTool.name,
    {
      title: "Jenkins Credential Management",
      description: jenkinsTools.jenkinsCredentialManagementTool.description,
      inputSchema: jenkinsTools.jenkinsCredentialManagementTool.inputSchema,
    },
    jenkinsTools.handleJenkinsCredentialManagement
  );

  mcp.registerTool(
    jenkinsTools.jenkinsSharedLibraryTool.name,
    {
      title: "Jenkins Shared Library",
      description: jenkinsTools.jenkinsSharedLibraryTool.description,
      inputSchema: jenkinsTools.jenkinsSharedLibraryTool.inputSchema,
    },
    jenkinsTools.handleJenkinsSharedLibrary
  );

  // Register Kubernetes tools
  mcp.registerTool(
    k8sTools.k8sManifestAnalysisTool.name,
    {
      title: "Analyze Kubernetes Manifest",
      description: k8sTools.k8sManifestAnalysisTool.description,
      inputSchema: k8sTools.k8sManifestAnalysisTool.inputSchema,
    },
    k8sTools.handleK8sManifestAnalysis
  );

  mcp.registerTool(
    k8sTools.k8sResourceGeneratorTool.name,
    {
      title: "Generate Kubernetes Resource",
      description: k8sTools.k8sResourceGeneratorTool.description,
      inputSchema: k8sTools.k8sResourceGeneratorTool.inputSchema,
    },
    k8sTools.handleK8sResourceGeneration
  );

  mcp.registerTool(
    k8sTools.k8sHelmChartAnalysisTool.name,
    {
      title: "Analyze Helm Chart",
      description: k8sTools.k8sHelmChartAnalysisTool.description,
      inputSchema: k8sTools.k8sHelmChartAnalysisTool.inputSchema,
    },
    k8sTools.handleK8sHelmChartAnalysis
  );

  mcp.registerTool(
    k8sTools.k8sSecurityScanTool.name,
    {
      title: "Kubernetes Security Scan",
      description: k8sTools.k8sSecurityScanTool.description,
      inputSchema: k8sTools.k8sSecurityScanTool.inputSchema,
    },
    k8sTools.handleK8sSecurityScan
  );

  mcp.registerTool(
    k8sTools.k8sResourceQuotaTool.name,
    {
      title: "Kubernetes Resource Quota",
      description: k8sTools.k8sResourceQuotaTool.description,
      inputSchema: k8sTools.k8sResourceQuotaTool.inputSchema,
    },
    k8sTools.handleK8sResourceQuota
  );

  mcp.registerTool(
    k8sTools.k8sNetworkPolicyTool.name,
    {
      title: "Kubernetes Network Policy",
      description: k8sTools.k8sNetworkPolicyTool.description,
      inputSchema: k8sTools.k8sNetworkPolicyTool.inputSchema,
    },
    k8sTools.handleK8sNetworkPolicy
  );

  // Register Cloud tools
  mcp.registerTool(
    cloudTools.cloudInfrastructureAnalysisTool.name,
    {
      title: "Analyze Cloud Infrastructure",
      description: cloudTools.cloudInfrastructureAnalysisTool.description,
      inputSchema: cloudTools.cloudInfrastructureAnalysisTool.inputSchema,
    },
    cloudTools.handleCloudInfrastructureAnalysis
  );

  mcp.registerTool(
    cloudTools.cloudSecurityAuditTool.name,
    {
      title: "Cloud Security Audit",
      description: cloudTools.cloudSecurityAuditTool.description,
      inputSchema: cloudTools.cloudSecurityAuditTool.inputSchema,
    },
    cloudTools.handleCloudSecurityAudit
  );

  mcp.registerTool(
    cloudTools.cloudCostOptimizationTool.name,
    {
      title: "Cloud Cost Optimization",
      description: cloudTools.cloudCostOptimizationTool.description,
      inputSchema: cloudTools.cloudCostOptimizationTool.inputSchema,
    },
    cloudTools.handleCloudCostOptimization
  );

  mcp.registerTool(
    cloudTools.cloudMigrationPlannerTool.name,
    {
      title: "Cloud Migration Planner",
      description: cloudTools.cloudMigrationPlannerTool.description,
      inputSchema: cloudTools.cloudMigrationPlannerTool.inputSchema,
    },
    cloudTools.handleCloudMigrationPlanner
  );

  mcp.registerTool(
    cloudTools.cloudBestPracticesLookupTool.name,
    {
      title: "Cloud Best Practices",
      description: cloudTools.cloudBestPracticesLookupTool.description,
      inputSchema: cloudTools.cloudBestPracticesLookupTool.inputSchema,
    },
    cloudTools.handleCloudBestPractices
  );

  mcp.registerTool(
    cloudTools.cloudDisasterRecoveryTool.name,
    {
      title: "Cloud Disaster Recovery",
      description: cloudTools.cloudDisasterRecoveryTool.description,
      inputSchema: cloudTools.cloudDisasterRecoveryTool.inputSchema,
    },
    cloudTools.handleCloudDisasterRecovery
  );

  // Register Repository tools
  mcp.registerTool(
    repoTools.repoHistoryAnalysisTool.name,
    {
      title: "Analyze Repository History",
      description: repoTools.repoHistoryAnalysisTool.description,
      inputSchema: repoTools.repoHistoryAnalysisTool.inputSchema,
    },
    repoTools.handleRepoHistoryAnalysis
  );

  mcp.registerTool(
    repoTools.repoFileTrackingTool.name,
    {
      title: "Track Repository Files",
      description: repoTools.repoFileTrackingTool.description,
      inputSchema: repoTools.repoFileTrackingTool.inputSchema,
    },
    repoTools.handleRepoFileTracking
  );

  mcp.registerTool(
    repoTools.repoContextMemoryTool.name,
    {
      title: "Repository Context Memory",
      description: repoTools.repoContextMemoryTool.description,
      inputSchema: repoTools.repoContextMemoryTool.inputSchema,
    },
    repoTools.handleRepoContextMemory
  );

  mcp.registerTool(
    repoTools.repoDependencyTrackingTool.name,
    {
      title: "Track Repository Dependencies",
      description: repoTools.repoDependencyTrackingTool.description,
      inputSchema: repoTools.repoDependencyTrackingTool.inputSchema,
    },
    repoTools.handleRepoDependencyTracking
  );

  mcp.registerTool(
    repoTools.repoInfrastructureMapTool.name,
    {
      title: "Map Repository Infrastructure",
      description: repoTools.repoInfrastructureMapTool.description,
      inputSchema: repoTools.repoInfrastructureMapTool.inputSchema,
    },
    repoTools.handleRepoInfrastructureMap
  );

  mcp.registerTool(
    repoTools.repoKnowledgeGraphTool.name,
    {
      title: "Repository Knowledge Graph",
      description: repoTools.repoKnowledgeGraphTool.description,
      inputSchema: repoTools.repoKnowledgeGraphTool.inputSchema,
    },
    repoTools.handleRepoKnowledgeGraph
  );

  // Register Ansible resources
  mcp.registerResource(
    "ansible-best-practices",
    ansibleResources.ansibleBestPracticesResource.uri,
    {
      title: ansibleResources.ansibleBestPracticesResource.name,
      description: ansibleResources.ansibleBestPracticesResource.description,
      mimeType: ansibleResources.ansibleBestPracticesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: ansibleResources.ansibleBestPracticesResource.uri,
        text: ansibleResources.ansibleBestPracticesResource.content,
        mimeType: ansibleResources.ansibleBestPracticesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "ansible-modules",
    ansibleResources.ansibleModulesResource.uri,
    {
      title: ansibleResources.ansibleModulesResource.name,
      description: ansibleResources.ansibleModulesResource.description,
      mimeType: ansibleResources.ansibleModulesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: ansibleResources.ansibleModulesResource.uri,
        text: ansibleResources.ansibleModulesResource.content,
        mimeType: ansibleResources.ansibleModulesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "ansible-playbook-patterns",
    ansibleResources.ansiblePlaybookPatternsResource.uri,
    {
      title: ansibleResources.ansiblePlaybookPatternsResource.name,
      description: ansibleResources.ansiblePlaybookPatternsResource.description,
      mimeType: ansibleResources.ansiblePlaybookPatternsResource.mimeType,
    },
    () => ({
      contents: [{
        uri: ansibleResources.ansiblePlaybookPatternsResource.uri,
        text: ansibleResources.ansiblePlaybookPatternsResource.content,
        mimeType: ansibleResources.ansiblePlaybookPatternsResource.mimeType,
      }],
    })
  );

  // Register Jenkins resources
  mcp.registerResource(
    "jenkins-pipeline-best-practices",
    jenkinsResources.jenkinsPipelineBestPracticesResource.uri,
    {
      title: jenkinsResources.jenkinsPipelineBestPracticesResource.name,
      description: jenkinsResources.jenkinsPipelineBestPracticesResource.description,
      mimeType: jenkinsResources.jenkinsPipelineBestPracticesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: jenkinsResources.jenkinsPipelineBestPracticesResource.uri,
        text: jenkinsResources.jenkinsPipelineBestPracticesResource.content,
        mimeType: jenkinsResources.jenkinsPipelineBestPracticesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "jenkins-shared-libraries",
    jenkinsResources.jenkinsSharedLibrariesResource.uri,
    {
      title: jenkinsResources.jenkinsSharedLibrariesResource.name,
      description: jenkinsResources.jenkinsSharedLibrariesResource.description,
      mimeType: jenkinsResources.jenkinsSharedLibrariesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: jenkinsResources.jenkinsSharedLibrariesResource.uri,
        text: jenkinsResources.jenkinsSharedLibrariesResource.content,
        mimeType: jenkinsResources.jenkinsSharedLibrariesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "jenkins-essential-plugins",
    jenkinsResources.jenkinsPluginsResource.uri,
    {
      title: jenkinsResources.jenkinsPluginsResource.name,
      description: jenkinsResources.jenkinsPluginsResource.description,
      mimeType: jenkinsResources.jenkinsPluginsResource.mimeType,
    },
    () => ({
      contents: [{
        uri: jenkinsResources.jenkinsPluginsResource.uri,
        text: jenkinsResources.jenkinsPluginsResource.content,
        mimeType: jenkinsResources.jenkinsPluginsResource.mimeType,
      }],
    })
  );

  // Register Kubernetes resources
  mcp.registerResource(
    "kubernetes-best-practices",
    k8sResources.kubernetesBestPracticesResource.uri,
    {
      title: k8sResources.kubernetesBestPracticesResource.name,
      description: k8sResources.kubernetesBestPracticesResource.description,
      mimeType: k8sResources.kubernetesBestPracticesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: k8sResources.kubernetesBestPracticesResource.uri,
        text: k8sResources.kubernetesBestPracticesResource.content,
        mimeType: k8sResources.kubernetesBestPracticesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "kubernetes-manifest-patterns",
    k8sResources.kubernetesManifestPatternsResource.uri,
    {
      title: k8sResources.kubernetesManifestPatternsResource.name,
      description: k8sResources.kubernetesManifestPatternsResource.description,
      mimeType: k8sResources.kubernetesManifestPatternsResource.mimeType,
    },
    () => ({
      contents: [{
        uri: k8sResources.kubernetesManifestPatternsResource.uri,
        text: k8sResources.kubernetesManifestPatternsResource.content,
        mimeType: k8sResources.kubernetesManifestPatternsResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "kubernetes-security",
    k8sResources.kubernetesSecurityResource.uri,
    {
      title: k8sResources.kubernetesSecurityResource.name,
      description: k8sResources.kubernetesSecurityResource.description,
      mimeType: k8sResources.kubernetesSecurityResource.mimeType,
    },
    () => ({
      contents: [{
        uri: k8sResources.kubernetesSecurityResource.uri,
        text: k8sResources.kubernetesSecurityResource.content,
        mimeType: k8sResources.kubernetesSecurityResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "kubernetes-helm",
    k8sResources.kubernetesHelmResource.uri,
    {
      title: k8sResources.kubernetesHelmResource.name,
      description: k8sResources.kubernetesHelmResource.description,
      mimeType: k8sResources.kubernetesHelmResource.mimeType,
    },
    () => ({
      contents: [{
        uri: k8sResources.kubernetesHelmResource.uri,
        text: k8sResources.kubernetesHelmResource.content,
        mimeType: k8sResources.kubernetesHelmResource.mimeType,
      }],
    })
  );

  // Register Cloud resources
  mcp.registerResource(
    "aws-best-practices",
    cloudResources.awsBestPracticesResource.uri,
    {
      title: cloudResources.awsBestPracticesResource.name,
      description: cloudResources.awsBestPracticesResource.description,
      mimeType: cloudResources.awsBestPracticesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: cloudResources.awsBestPracticesResource.uri,
        text: cloudResources.awsBestPracticesResource.content,
        mimeType: cloudResources.awsBestPracticesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "azure-best-practices",
    cloudResources.azureBestPracticesResource.uri,
    {
      title: cloudResources.azureBestPracticesResource.name,
      description: cloudResources.azureBestPracticesResource.description,
      mimeType: cloudResources.azureBestPracticesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: cloudResources.azureBestPracticesResource.uri,
        text: cloudResources.azureBestPracticesResource.content,
        mimeType: cloudResources.azureBestPracticesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "gcp-best-practices",
    cloudResources.gcpBestPracticesResource.uri,
    {
      title: cloudResources.gcpBestPracticesResource.name,
      description: cloudResources.gcpBestPracticesResource.description,
      mimeType: cloudResources.gcpBestPracticesResource.mimeType,
    },
    () => ({
      contents: [{
        uri: cloudResources.gcpBestPracticesResource.uri,
        text: cloudResources.gcpBestPracticesResource.content,
        mimeType: cloudResources.gcpBestPracticesResource.mimeType,
      }],
    })
  );

  mcp.registerResource(
    "terraform-best-practices",
    cloudResources.terraformBestPracticesResource.uri,
    {
      title: cloudResources.terraformBestPracticesResource.name,
      description: cloudResources.terraformBestPracticesResource.description,
      mimeType: cloudResources.terraformBestPracticesResource.mimeType,
    },
    () => ({
      contents: [],
      text: "",
      mimeType: "text/json",
    })
   )
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
    () => ({
      contents: [{
        uri: cloudResources.terraformBestPracticesResource.uri,
        text: cloudResources.terraformBestPracticesResource.content,
        mimeType: cloudResources.terraformBestPracticesResource.mimeType,
      }],
    })
  );

  return mcp.server;
}
