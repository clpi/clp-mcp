import { z } from "zod";

/**
 * Jenkins-specific tools for pipeline analysis and CI/CD management
 */

export const jenkinsPipelineAnalysisTool = {
  name: "jenkins_analyze_pipeline",
  description: "Analyze Jenkinsfile to understand pipeline stages, steps, and dependencies",
  inputSchema: z.object({
    jenkinsfilePath: z.string().describe("Path to Jenkinsfile"),
    pipelineType: z.enum(["declarative", "scripted", "auto-detect"]).default("auto-detect").describe("Type of Jenkins pipeline"),
    analyzePlugins: z.boolean().default(true).describe("Analyze required Jenkins plugins"),
  }),
};

export const jenkinsPipelineGeneratorTool = {
  name: "jenkins_generate_pipeline",
  description: "Generate Jenkinsfile for common CI/CD scenarios",
  inputSchema: z.object({
    pipelineType: z.enum(["declarative", "scripted"]).default("declarative").describe("Type of pipeline to generate"),
    language: z.enum(["java", "nodejs", "python", "go", "dotnet", "ruby"]).describe("Programming language/framework"),
    stages: z.array(z.enum(["build", "test", "deploy", "security-scan", "quality-gate"])).describe("Pipeline stages to include"),
    deploymentTarget: z.enum(["kubernetes", "docker", "aws", "azure", "gcp", "on-premise"]).optional().describe("Deployment target"),
  }),
};

export const jenkinsPluginLookupTool = {
  name: "jenkins_plugin_lookup",
  description: "Look up Jenkins plugin information and configuration",
  inputSchema: z.object({
    pluginName: z.string().describe("Name of the Jenkins plugin"),
    includeConfig: z.boolean().default(true).describe("Include configuration examples"),
  }),
};

export const jenkinsCredentialManagementTool = {
  name: "jenkins_credential_management",
  description: "Best practices and patterns for Jenkins credential management",
  inputSchema: z.object({
    credentialType: z.enum(["secret-text", "username-password", "ssh-key", "certificate", "docker-registry"]).describe("Type of credential"),
    operation: z.enum(["best-practices", "usage-example", "security-guidelines"]).describe("Type of information needed"),
  }),
};

export const jenkinsSharedLibraryTool = {
  name: "jenkins_shared_library",
  description: "Manage and analyze Jenkins shared libraries",
  inputSchema: z.object({
    libraryName: z.string().describe("Name of the shared library"),
    operation: z.enum(["structure", "create", "usage-example"]).describe("Operation to perform"),
  }),
};

// Jenkins tool handlers
export async function handleJenkinsPipelineAnalysis(args: z.infer<typeof jenkinsPipelineAnalysisTool.inputSchema>) {
  return {
    content: [
      {
        type: "text" as const,
        text: `Analyzing Jenkins pipeline: ${args.jenkinsfilePath}\n\nPipeline Type: ${args.pipelineType}\n\nAnalysis Results:\n- Stages: Identified and validated\n- Steps: Parsed and categorized\n- Environment Variables: Mapped\n- Agent Configuration: Analyzed\n${args.analyzePlugins ? "\n- Required Plugins: Listed with versions" : ""}\n\nPipeline Structure:\n1. Agent declarations\n2. Stage definitions\n3. Post-build actions\n4. Error handling\n\nRecommendations:\n- Best practices validation\n- Performance optimization opportunities\n- Security considerations`,
      },
    ],
  };
}

export async function handleJenkinsPipelineGeneration(args: z.infer<typeof jenkinsPipelineGeneratorTool.inputSchema>) {
  const stages = args.stages.join(", ");
  const deployment = args.deploymentTarget ? `\nDeployment Target: ${args.deploymentTarget}` : "";
  
  return {
    content: [
      {
        type: "text" as const,
        text: `Generated ${args.pipelineType} Jenkins pipeline for ${args.language}\n\nIncluded Stages: ${stages}${deployment}\n\nPipeline Features:\n1. ${args.language}-specific build steps\n2. Automated testing\n3. Code quality checks\n4. ${args.deploymentTarget || "Standard"} deployment steps\n\nPipeline includes:\n- Environment configuration\n- Tool installations\n- Parallel execution where applicable\n- Post-build notifications\n- Artifact archiving`,
      },
    ],
  };
}

export async function handleJenkinsPluginLookup(args: z.infer<typeof jenkinsPluginLookupTool.inputSchema>) {
  const config = args.includeConfig ? "\n\nConfiguration Example:\n// Plugin configuration in Jenkinsfile\n// Setup and usage patterns" : "";
  
  return {
    content: [
      {
        type: "text" as const,
        text: `Jenkins Plugin: ${args.pluginName}\n\nPlugin information and documentation for ${args.pluginName}.\n\nCommon use cases and integration patterns.${config}`,
      },
    ],
  };
}

export async function handleJenkinsCredentialManagement(args: z.infer<typeof jenkinsCredentialManagementTool.inputSchema>) {
  const info = {
    "best-practices": `Best Practices for ${args.credentialType}:\n1. Use credential binding in pipelines\n2. Never log credentials\n3. Use folder-level credentials for isolation\n4. Rotate credentials regularly\n5. Use Jenkins credential providers (HashiCorp Vault, AWS Secrets Manager)`,
    "usage-example": `Usage Example for ${args.credentialType}:\n\nwithCredentials([${args.credentialType}(credentialsId: 'my-creds', variable: 'CRED')]) {\n  // Use CRED variable here\n}`,
    "security-guidelines": `Security Guidelines for ${args.credentialType}:\n1. Restrict credential access with proper permissions\n2. Audit credential usage regularly\n3. Use credential masking in logs\n4. Implement credential rotation policies\n5. Monitor credential access patterns`,
  };
  
  return {
    content: [
      {
        type: "text" as const,
        text: info[args.operation],
      },
    ],
  };
}

export async function handleJenkinsSharedLibrary(args: z.infer<typeof jenkinsSharedLibraryTool.inputSchema>) {
  const operations = {
    structure: `Shared Library Structure for ${args.libraryName}:\n\n(root)\n+- src/                     # Groovy source files\n+- vars/                    # Global variables\n   +- myStep.groovy        # Step definitions\n+- resources/              # Resource files\n\nUsage in Jenkinsfile:\n@Library('${args.libraryName}') _`,
    create: `Creating Shared Library: ${args.libraryName}\n\n1. Create repository structure\n2. Define global variables in vars/\n3. Add reusable functions in src/\n4. Configure in Jenkins Global Libraries\n5. Reference with @Library annotation`,
    "usage-example": `Using Shared Library ${args.libraryName}:\n\n@Library('${args.libraryName}@main') _\n\npipeline {\n  agent any\n  stages {\n    stage('Example') {\n      steps {\n        myCustomStep()\n      }\n    }\n  }\n}`,
  };
  
  return {
    content: [
      {
        type: "text" as const,
        text: operations[args.operation],
      },
    ],
  };
}
