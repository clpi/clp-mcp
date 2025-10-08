import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import console from "node:console"
import process from "node:process"
import { } from "@smithery/sdk"
import {z} from "zod"

// Import DevOps tools
import * as ansibleTools from "../tool/devops/ansible"
import * as jenkinsTools from "../tool/devops/jenkins"
import * as k8sTools from "../tool/devops/kubernetes"
import * as cloudTools from "../tool/devops/cloud"
import * as repoTools from "../tool/devops/repository"

// Import DevOps resources
import * as ansibleResources from "../resource/devops/ansible"
import * as jenkinsResources from "../resource/devops/jenkins"
import * as k8sResources from "../resource/devops/kubernetes"
import * as cloudResources from "../resource/devops/cloud"

// Import DevOps prompts
import * as devopsPrompts from "../prompt/devops"

export class ClpMcp {
  readonly name: string = "clp-mcp"
  readonly version: string = "0.0.1"
  readonly title: string = "CLP MCP"
  readonly description: string = "A simple MCP server for CLP"
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
    description: "A simple MCP server for CLP",
    websiteUrl: "pecunies.com",
  });

  // Add a tool
  mcp.registerTool(
    "init",
    {
      title: "init",
      description: "Initialize something",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The text content"),
          }),
        ),
      } ,
      inputSchema: { name: z.string().describe("Initialize something") },
    },
    ({ name }) => ({
      content: [{ type: "text", text: `Initialized with ${name}!` }],
    }),
  );

  mcp.registerTool(
    "add",
    {
      title: "add",
      description: "Add context",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The text content"),
          }),
        ),
      },
      inputSchema: { name: z.string().describe("Add context") },
    },
    ({ name }) => ({
      content: [{ type: "text", text: `Initialized with ${name}!` }],
    }),
  );
  // Add a resource
  mcp.registerResource(
    "repositories",
    "clp://repositories",
    {
      title: "Git Repositories",
      description: "The origin story of the famous 'Hello, World' program",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: '"Hello, World" first appeared in a 1972 Bell Labs memo by Brian Kernighan and later became the iconic first program for beginners in countless languages.',
          mimeType: "text/plain",
          inputSchema: z.object({
            title: z.string().describe("Title of the text entry"),
            author: z.string().optional().describe("Author of the text entry"),
            url: z.string().describe("URL of the text entry"),
          }),
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
      contents: [{
        uri: cloudResources.terraformBestPracticesResource.uri,
        text: cloudResources.terraformBestPracticesResource.content,
        mimeType: cloudResources.terraformBestPracticesResource.mimeType,
      }],
    })
  );

  return mcp.server;
}
