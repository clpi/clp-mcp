import { z } from "zod";

export const jenkinsTools = {
  validateJenkinsfile: {
    name: "validate_jenkinsfile",
    title: "Validate Jenkinsfile",
    description: "Validate a Jenkinsfile for syntax and common issues",
    inputSchema: z.object({
      content: z.string().describe("The Jenkinsfile content to validate"),
    }),
    handler: async ({ content }: { content: string }) => {
      const issues: string[] = [];
      
      // Basic validation checks
      if (!content.includes("pipeline")) {
        issues.push("Missing 'pipeline' block - declarative pipelines must start with 'pipeline'");
      }
      
      if (!content.includes("agent")) {
        issues.push("Missing 'agent' directive - pipeline must specify where to run");
      }
      
      if (!content.includes("stages")) {
        issues.push("Missing 'stages' block - pipeline should define stages");
      }
      
      // Check for common mistakes
      if (content.includes("node {") && content.includes("pipeline {")) {
        issues.push("Mixing scripted and declarative pipeline syntax");
      }
      
      // Check for security issues
      if (content.includes("password") || content.includes("token")) {
        issues.push("WARNING: Potential hardcoded credentials detected");
      }
      
      const isValid = issues.length === 0;
      
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              valid: isValid,
              issues: isValid ? ["Jenkinsfile appears valid"] : issues,
              suggestions: [
                "Use credentials() for sensitive data",
                "Add post blocks for cleanup",
                "Consider using shared libraries for reusable code",
              ],
            }, null, 2),
          }
        ]
      };
    },
  },

  generateJenkinsfile: {
    name: "generate_jenkinsfile",
    title: "Generate Jenkinsfile",
    description: "Generate a Jenkinsfile template based on project requirements",
    inputSchema: z.object({
      projectType: z.enum(["nodejs", "python", "java", "docker", "terraform"]).describe("Type of project"),
      stages: z.array(z.string()).describe("Pipeline stages (e.g., build, test, deploy)"),
      agent: z.string().default("any").describe("Agent to run on (any, docker, kubernetes, etc.)"),
    }),
    handler: async ({ projectType, stages, agent }: { projectType: string; stages: string[]; agent: string }) => {
      const stageBlocks = stages.map(stage => {
        const stageContent = getStageContent(projectType, stage);
        return `        stage('${capitalize(stage)}') {
            steps {
                ${stageContent}
            }
        }`;
      }).join('\n');

      const jenkinsfile = `pipeline {
    agent ${agent === 'any' ? 'any' : `{ ${agent} }`}
    
    environment {
        // Define environment variables here
    }
    
    stages {
${stageBlocks}
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`;

      return {
        content: [
          {
            type: "text" as const,
            text: jenkinsfile,
          }
        ]
      };
    },
  },

  analyzeJenkinsPipeline: {
    name: "analyze_jenkins_pipeline",
    title: "Analyze Jenkins Pipeline",
    description: "Analyze a Jenkins pipeline for optimization opportunities and best practices",
    inputSchema: z.object({
      content: z.string().describe("The Jenkinsfile content to analyze"),
    }),
    handler: async ({ content }: { content: string }) => {
      const recommendations: string[] = [];
      const metrics = {
        stageCount: (content.match(/stage\(/g) || []).length,
        hasParallelStages: content.includes("parallel"),
        hasPostBlock: content.includes("post {"),
        usesCredentials: content.includes("credentials("),
        hasTimeout: content.includes("timeout"),
      };

      if (!metrics.hasParallelStages && metrics.stageCount > 2) {
        recommendations.push("Consider using parallel stages to speed up pipeline execution");
      }

      if (!metrics.hasPostBlock) {
        recommendations.push("Add post block for cleanup and notifications");
      }

      if (!metrics.usesCredentials && (content.includes("password") || content.includes("key"))) {
        recommendations.push("Use Jenkins credentials store instead of hardcoding secrets");
      }

      if (!metrics.hasTimeout) {
        recommendations.push("Add timeout blocks to prevent hanging builds");
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              metrics,
              recommendations,
              complexity: metrics.stageCount > 5 ? "high" : metrics.stageCount > 2 ? "medium" : "low",
            }, null, 2),
          }
        ]
      };
    },
  },
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStageContent(projectType: string, stage: string): string {
  const templates: Record<string, Record<string, string>> = {
    nodejs: {
      build: "sh 'npm install'",
      test: "sh 'npm test'",
      deploy: "sh 'npm run deploy'",
    },
    python: {
      build: "sh 'pip install -r requirements.txt'",
      test: "sh 'pytest'",
      deploy: "sh 'python setup.py deploy'",
    },
    java: {
      build: "sh 'mvn clean package'",
      test: "sh 'mvn test'",
      deploy: "sh 'mvn deploy'",
    },
    docker: {
      build: "sh 'docker build -t myapp:${BUILD_NUMBER} .'",
      test: "sh 'docker run myapp:${BUILD_NUMBER} npm test'",
      deploy: "sh 'docker push myapp:${BUILD_NUMBER}'",
    },
    terraform: {
      build: "sh 'terraform init'",
      test: "sh 'terraform validate'",
      deploy: "sh 'terraform apply -auto-approve'",
    },
  };

  return templates[projectType]?.[stage] || `echo 'Running ${stage}'`;
}
