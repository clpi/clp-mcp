import { z } from "zod";

export const dockerTools = {
  validateDockerfile: {
    name: "validate_dockerfile",
    title: "Validate Dockerfile",
    description: "Validate a Dockerfile for syntax and best practices",
    inputSchema: z.object({
      content: z.string().describe("The Dockerfile content to validate"),
    }),
    handler: async ({ content }: { content: string }) => {
      const issues: string[] = [];
      const warnings: string[] = [];
      const recommendations: string[] = [];

      // Basic structure checks
      if (!content.includes("FROM")) {
        issues.push("Missing FROM instruction - Dockerfile must start with FROM");
      }

      // Best practices
      const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
      
      if (!content.includes("USER")) {
        warnings.push("Consider adding USER instruction to run as non-root");
      }

      if (!content.includes("HEALTHCHECK")) {
        warnings.push("Consider adding HEALTHCHECK instruction");
      }

      // Check for multiple RUN commands that could be combined
      const runCount = (content.match(/^RUN /gm) || []).length;
      if (runCount > 3) {
        warnings.push(`Found ${runCount} RUN commands - consider combining to reduce layers`);
      }

      // Security checks
      if (content.match(/RUN.*apt-get.*install/i) && !content.includes("--no-install-recommends")) {
        recommendations.push("Use --no-install-recommends with apt-get to reduce image size");
      }

      if (content.includes("ADD") && !content.includes("http")) {
        recommendations.push("Prefer COPY over ADD unless you need ADD's features");
      }

      if (content.match(/COPY.*\//)) {
        recommendations.push("Be specific about what to COPY - avoid copying entire directories when possible");
      }

      // Check for secrets
      if (content.match(/password|secret|key|token/i)) {
        issues.push("CRITICAL: Potential secrets detected - use build arguments or mount secrets");
      }

      // Multi-stage build detection
      const fromCount = (content.match(/^FROM /gm) || []).length;
      if (fromCount === 1) {
        recommendations.push("Consider multi-stage builds to reduce final image size");
      }

      // Layer optimization
      if (!content.match(/RUN.*&&/)) {
        recommendations.push("Chain commands with && to reduce layers");
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              valid: issues.length === 0,
              issues,
              warnings,
              recommendations: [
                ...recommendations,
                "Use .dockerignore to exclude unnecessary files",
                "Pin base image versions for reproducibility",
                "Clean up package manager caches in the same layer",
              ],
            }, null, 2),
          }
        ]
      };
    },
  },

  generateDockerfile: {
    name: "generate_dockerfile",
    title: "Generate Dockerfile",
    description: "Generate a Dockerfile template based on project type",
    inputSchema: z.object({
      projectType: z.enum([
        "nodejs",
        "python",
        "java",
        "go",
        "rust",
        "ruby",
        "php",
        "dotnet",
      ]).describe("Type of project"),
      includeMultiStage: z.boolean().default(true).describe("Use multi-stage build"),
      baseImage: z.string().optional().describe("Custom base image"),
    }),
    handler: async ({ projectType, includeMultiStage, baseImage }: {
      projectType: string;
      includeMultiStage: boolean;
      baseImage?: string;
    }) => {
      const dockerfile = generateDockerfileTemplate(projectType, includeMultiStage, baseImage);

      return {
        content: [
          {
            type: "text" as const,
            text: dockerfile,
          }
        ]
      };
    },
  },

  generateDockerCompose: {
    name: "generate_docker_compose",
    title: "Generate Docker Compose File",
    description: "Generate a docker-compose.yml file for multi-container applications",
    inputSchema: z.object({
      services: z.array(z.object({
        name: z.string(),
        type: z.enum(["app", "database", "cache", "queue", "custom"]),
        ports: z.array(z.string()).optional(),
        environment: z.record(z.string()).optional(),
      })).describe("Services to include"),
      version: z.string().default("3.8").describe("Docker Compose file format version"),
    }),
    handler: async ({ services, version }: {
      services: Array<{ name: string; type: string; ports?: string[]; environment?: Record<string, string> }>;
      version: string;
    }) => {
      let compose = `version: '${version}'\n\nservices:\n`;

      services.forEach(service => {
        compose += `  ${service.name}:\n`;
        
        const template = getServiceTemplate(service.type, service.name);
        compose += template;

        if (service.ports && service.ports.length > 0) {
          compose += `    ports:\n`;
          service.ports.forEach(port => {
            compose += `      - "${port}"\n`;
          });
        }

        if (service.environment) {
          compose += `    environment:\n`;
          Object.entries(service.environment).forEach(([key, value]) => {
            compose += `      ${key}: ${value}\n`;
          });
        }

        compose += '\n';
      });

      compose += `networks:
  default:
    name: app-network

volumes:
  db-data:
  cache-data:
`;

      return {
        content: [
          {
            type: "text" as const,
            text: compose,
          }
        ]
      };
    },
  },

  optimizeDockerfile: {
    name: "optimize_dockerfile",
    title: "Optimize Dockerfile",
    description: "Suggest optimizations for a Dockerfile",
    inputSchema: z.object({
      content: z.string().describe("The Dockerfile content to optimize"),
    }),
    handler: async ({ content }: { content: string }) => {
      const optimizations: Array<{ type: string; suggestion: string; impact: string }> = [];

      // Check for layer optimization
      const runCommands = content.match(/^RUN .+$/gm) || [];
      if (runCommands.length > 3) {
        optimizations.push({
          type: "layers",
          suggestion: "Combine multiple RUN commands with && to reduce layers",
          impact: "Reduces image size by ~10-20%",
        });
      }

      // Check for cache optimization
      if (content.includes("COPY . .") && content.includes("RUN npm install")) {
        if (content.indexOf("COPY . .") < content.indexOf("RUN npm install")) {
          optimizations.push({
            type: "cache",
            suggestion: "Copy package files first, install dependencies, then copy source code",
            impact: "Improves build cache efficiency significantly",
          });
        }
      }

      // Check for base image optimization
      if (content.match(/FROM.*:latest/)) {
        optimizations.push({
          type: "versioning",
          suggestion: "Pin base image to specific version instead of 'latest'",
          impact: "Ensures reproducible builds",
        });
      }

      if (!content.includes("alpine") && !content.includes("slim")) {
        optimizations.push({
          type: "size",
          suggestion: "Consider using alpine or slim base images",
          impact: "Can reduce image size by 50-90%",
        });
      }

      // Check for cleanup
      if (content.includes("apt-get install") && !content.includes("rm -rf /var/lib/apt/lists/*")) {
        optimizations.push({
          type: "cleanup",
          suggestion: "Clean up apt cache in the same layer: && rm -rf /var/lib/apt/lists/*",
          impact: "Reduces image size by ~50-100MB",
        });
      }

      // Multi-stage build suggestion
      const fromCount = (content.match(/^FROM /gm) || []).length;
      if (fromCount === 1 && (content.includes("build") || content.includes("compile"))) {
        optimizations.push({
          type: "multistage",
          suggestion: "Use multi-stage build to separate build and runtime environments",
          impact: "Can reduce final image size by 70-90%",
        });
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              totalOptimizations: optimizations.length,
              optimizations,
              estimatedSizeReduction: optimizations.length > 3 ? "50-70%" : optimizations.length > 1 ? "20-40%" : "10-20%",
            }, null, 2),
          }
        ]
      };
    },
  },

  analyzeDockerImage: {
    name: "analyze_docker_image",
    title: "Analyze Docker Image",
    description: "Analyze a Docker image structure and provide insights",
    inputSchema: z.object({
      imageLayers: z.array(z.string()).describe("Image layers information"),
      totalSize: z.number().optional().describe("Total image size in MB"),
    }),
    handler: async ({ imageLayers, totalSize }: { imageLayers: string[]; totalSize?: number }) => {
      const analysis = {
        layerCount: imageLayers.length,
        totalSize: totalSize ? `${totalSize}MB` : "unknown",
        largestLayers: imageLayers.slice(0, 5),
        recommendations: [] as string[],
      };

      if (imageLayers.length > 30) {
        analysis.recommendations.push("High layer count - consider combining commands to reduce layers");
      }

      if (totalSize && totalSize > 1000) {
        analysis.recommendations.push("Large image size - consider using multi-stage builds and alpine base");
      }

      analysis.recommendations.push("Use 'docker history <image>' to see layer sizes");
      analysis.recommendations.push("Use 'dive' tool for interactive image analysis");

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(analysis, null, 2),
          }
        ]
      };
    },
  },
};

function generateDockerfileTemplate(projectType: string, multiStage: boolean, customBase?: string): string {
  const templates: Record<string, { single: string; multi: string }> = {
    nodejs: {
      single: `FROM ${customBase || 'node:18-alpine'}

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node

EXPOSE 3000

CMD ["node", "index.js"]`,
      multi: `# Build stage
FROM ${customBase || 'node:18-alpine'} AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM ${customBase || 'node:18-alpine'}

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]`,
    },
    python: {
      single: `FROM ${customBase || 'python:3.11-slim'}

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["python", "app.py"]`,
      multi: `# Build stage
FROM ${customBase || 'python:3.11'} AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM ${customBase || 'python:3.11-slim'}

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH

RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["python", "app.py"]`,
    },
    java: {
      single: `FROM ${customBase || 'openjdk:17-slim'}

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]`,
      multi: `# Build stage
FROM ${customBase || 'maven:3.8-openjdk-17'} AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

# Production stage
FROM ${customBase || 'openjdk:17-slim'}

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]`,
    },
    go: {
      single: `FROM ${customBase || 'golang:1.21-alpine'}

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]`,
      multi: `# Build stage
FROM ${customBase || 'golang:1.21-alpine'} AS builder

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]`,
    },
  };

  const template = templates[projectType];
  if (!template) {
    return `# Dockerfile for ${projectType}\nFROM ${customBase || 'ubuntu:latest'}\n\n# Add your build instructions here`;
  }

  return multiStage ? template.multi : template.single;
}

function getServiceTemplate(type: string, name: string): string {
  const templates: Record<string, string> = {
    app: `    build: .
    restart: unless-stopped
    depends_on:
      - db
`,
    database: `    image: postgres:15-alpine
    restart: unless-stopped
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${name}
      POSTGRES_USER: user
      POSTGRES_PASSWORD: \${DB_PASSWORD}
`,
    cache: `    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - cache-data:/data
`,
    queue: `    image: rabbitmq:3-management-alpine
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: user
      RABBITMQ_DEFAULT_PASS: \${RABBITMQ_PASSWORD}
`,
    custom: `    image: nginx:alpine
    restart: unless-stopped
`,
  };

  return templates[type] || templates.custom;
}
