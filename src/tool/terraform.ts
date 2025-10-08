import { z } from "zod";

export const terraformTools = {
  validateTerraform: {
    name: "validate_terraform",
    title: "Validate Terraform Configuration",
    description: "Validate Terraform configuration files for syntax and best practices",
    inputSchema: z.object({
      content: z.string().describe("The Terraform configuration content to validate"),
    }),
    handler: async ({ content }: { content: string }) => {
      const issues: string[] = [];
      const warnings: string[] = [];

      // Basic structure checks
      if (!content.includes("terraform {") && !content.includes("resource ") && !content.includes("data ")) {
        issues.push("No Terraform configuration blocks found");
      }

      // Best practices
      if (content.includes("terraform {") && !content.includes("required_version")) {
        warnings.push("Consider specifying required_version in terraform block");
      }

      if (content.includes("terraform {") && !content.includes("backend")) {
        warnings.push("Consider configuring a backend for state management");
      }

      // Security checks
      if (content.match(/password\s*=\s*"[^"]+"/)) {
        issues.push("CRITICAL: Hardcoded password detected - use variables or secrets manager");
      }

      if (content.match(/access_key\s*=\s*"[^"]+"/)) {
        issues.push("CRITICAL: Hardcoded access key detected - use environment variables");
      }

      // Resource naming
      if (!content.includes("tags") && content.includes("resource ")) {
        warnings.push("Resources should include tags for organization and cost tracking");
      }

      // Variable validation
      if (content.includes("variable ") && !content.includes("description")) {
        warnings.push("Variables should include descriptions");
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
                "Use terraform fmt to format configuration",
                "Use terraform validate for syntax checking",
                "Store sensitive values in terraform.tfvars (gitignored)",
                "Use remote state with locking",
                "Implement module versioning",
              ],
            }, null, 2),
          }
        ]
      };
    },
  },

  generateTerraformModule: {
    name: "generate_terraform_module",
    title: "Generate Terraform Module",
    description: "Generate a Terraform module template",
    inputSchema: z.object({
      moduleType: z.enum([
        "vpc",
        "ec2",
        "rds",
        "s3",
        "lambda",
        "eks",
        "iam",
        "security_group",
      ]).describe("Type of module to generate"),
      provider: z.enum(["aws", "azure", "gcp"]).describe("Cloud provider"),
      includeVariables: z.boolean().default(true).describe("Include variables.tf"),
      includeOutputs: z.boolean().default(true).describe("Include outputs.tf"),
    }),
    handler: async ({ moduleType, provider, includeVariables, includeOutputs }: {
      moduleType: string;
      provider: string;
      includeVariables: boolean;
      includeOutputs: boolean;
    }) => {
      const mainTf = generateMainTf(moduleType, provider);
      const variablesTf = includeVariables ? generateVariablesTf(moduleType) : "";
      const outputsTf = includeOutputs ? generateOutputsTf(moduleType) : "";

      const files = {
        "main.tf": mainTf,
        ...(includeVariables && { "variables.tf": variablesTf }),
        ...(includeOutputs && { "outputs.tf": outputsTf }),
        "README.md": generateReadme(moduleType),
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(files, null, 2),
          }
        ]
      };
    },
  },

  formatTerraform: {
    name: "format_terraform",
    title: "Format Terraform Configuration",
    description: "Format Terraform configuration to canonical style",
    inputSchema: z.object({
      content: z.string().describe("The Terraform content to format"),
    }),
    handler: async ({ content }: { content: string }) => {
      // Basic formatting (simplified - real terraform fmt is more complex)
      let formatted = content
        .replace(/{\s+/g, "{\n  ")
        .replace(/\s+}/g, "\n}")
        .replace(/=\s+/g, " = ")
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n');

      return {
        content: [
          {
            type: "text" as const,
            text: formatted,
          }
        ]
      };
    },
  },

  analyzeTerraformState: {
    name: "analyze_terraform_state",
    title: "Analyze Terraform State",
    description: "Analyze Terraform state for insights and recommendations",
    inputSchema: z.object({
      stateContent: z.string().describe("The Terraform state JSON content"),
    }),
    handler: async ({ stateContent }: { stateContent: string }) => {
      try {
        const state = JSON.parse(stateContent);
        const resources = state.resources || [];

        const analysis = {
          version: state.terraform_version,
          resourceCount: resources.length,
          resourceTypes: [...new Set(resources.map((r: any) => r.type))],
          modules: [...new Set(resources.map((r: any) => r.module).filter(Boolean))],
          providers: [...new Set(resources.map((r: any) => r.provider))],
          recommendations: [] as string[],
        };

        if (resources.length > 50) {
          analysis.recommendations.push("Consider splitting into multiple modules");
        }

        if (!state.backend) {
          analysis.recommendations.push("Configure remote backend for state management");
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(analysis, null, 2),
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error parsing state: ${error}`,
            }
          ],
          isError: true,
        };
      }
    },
  },

  generateTerraformBackend: {
    name: "generate_terraform_backend",
    title: "Generate Terraform Backend Configuration",
    description: "Generate backend configuration for state management",
    inputSchema: z.object({
      backendType: z.enum(["s3", "azurerm", "gcs", "consul", "kubernetes"]).describe("Backend type"),
      config: z.record(z.string()).describe("Backend configuration parameters"),
    }),
    handler: async ({ backendType, config }: { backendType: string; config: Record<string, string> }) => {
      const configStr = Object.entries(config)
        .map(([key, value]) => `    ${key} = "${value}"`)
        .join('\n');

      const backend = `terraform {
  backend "${backendType}" {
${configStr}
  }
}`;

      return {
        content: [
          {
            type: "text" as const,
            text: backend,
          }
        ]
      };
    },
  },
};

function generateMainTf(moduleType: string, provider: string): string {
  const templates: Record<string, Record<string, string>> = {
    aws: {
      vpc: `resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name = var.vpc_name
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "\${var.vpc_name}-public-\${count.index + 1}"
  })
}`,
      ec2: `resource "aws_instance" "main" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  
  vpc_security_group_ids = var.security_group_ids

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
  }

  tags = merge(var.tags, {
    Name = var.instance_name
  })
}`,
      rds: `resource "aws_db_instance" "main" {
  identifier     = var.db_identifier
  engine         = var.engine
  engine_version = var.engine_version
  instance_class = var.instance_class
  
  allocated_storage = var.allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = var.security_group_ids
  db_subnet_group_name   = var.db_subnet_group_name

  backup_retention_period = var.backup_retention_period
  skip_final_snapshot     = var.skip_final_snapshot

  tags = var.tags
}`,
      s3: `resource "aws_s3_bucket" "main" {
  bucket = var.bucket_name

  tags = var.tags
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`,
    },
  };

  return templates[provider]?.[moduleType] || `# ${moduleType} module for ${provider}\n`;
}

function generateVariablesTf(moduleType: string): string {
  return `variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "name" {
  description = "Name to be used on all resources as prefix"
  type        = string
}

# Add more variables specific to ${moduleType}
`;
}

function generateOutputsTf(moduleType: string): string {
  return `output "id" {
  description = "The ID of the ${moduleType}"
  value       = # TODO: Add appropriate resource reference
}

output "arn" {
  description = "The ARN of the ${moduleType}"
  value       = # TODO: Add appropriate resource reference
}
`;
}

function generateReadme(moduleType: string): string {
  return `# ${moduleType.toUpperCase()} Terraform Module

## Usage

\`\`\`hcl
module "${moduleType}" {
  source = "./modules/${moduleType}"

  name = "example"
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
\`\`\`

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |

## Inputs

See variables.tf for all available inputs.

## Outputs

See outputs.tf for all available outputs.
`;
}
