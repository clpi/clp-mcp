/**
 * Cloud services knowledge resources
 */

export const awsBestPracticesResource = {
  uri: "devops://cloud/aws-best-practices",
  name: "AWS Best Practices",
  description: "AWS Well-Architected Framework best practices",
  mimeType: "text/markdown",
  content: `# AWS Best Practices

## Five Pillars of Well-Architected Framework

### 1. Operational Excellence
- Infrastructure as Code (CloudFormation, Terraform)
- Continuous integration and deployment
- Monitoring and observability
- Regular review of operational procedures

### 2. Security
- Identity and Access Management (IAM)
- Detective controls (CloudTrail, Config)
- Infrastructure protection (Security Groups, NACLs)
- Data protection (encryption at rest and in transit)
- Incident response procedures

### 3. Reliability
- Automatic recovery from failure
- Scale horizontally for availability
- Stop guessing capacity (Auto Scaling)
- Manage change through automation

### 4. Performance Efficiency
- Use appropriate instance types
- Serverless architectures where suitable
- Experiment with different configurations
- Monitor performance metrics

### 5. Cost Optimization
- Right-sizing instances
- Reserved Instances and Savings Plans
- Use Spot Instances for fault-tolerant workloads
- Monitor and analyze costs

## Common Services Best Practices

### EC2
- Use Auto Scaling Groups
- Implement proper IAM roles
- Enable detailed monitoring
- Regular patching and updates
- Use latest generation instances

### S3
- Enable versioning for critical data
- Use lifecycle policies
- Enable encryption
- Use bucket policies and ACLs appropriately
- Enable access logging

### RDS
- Enable Multi-AZ for production
- Regular automated backups
- Use parameter groups for configuration
- Enable encryption
- Monitor performance metrics

### Lambda
- Keep functions small and focused
- Use environment variables
- Set appropriate memory allocation
- Implement proper error handling
- Use layers for shared code

### VPC
- Use multiple Availability Zones
- Implement proper subnet strategy
- Use Security Groups effectively
- Enable VPC Flow Logs
- Use NAT Gateways for high availability

## Security Best Practices

### IAM
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
\`\`\`

- Use least privilege principle
- Enable MFA for privileged users
- Rotate credentials regularly
- Use IAM roles instead of access keys

### Encryption
- Enable encryption at rest (EBS, S3, RDS)
- Use AWS KMS for key management
- Enable encryption in transit (TLS/SSL)
- Implement proper key rotation

## Cost Optimization Strategies

1. **Right-sizing**
   - Analyze CloudWatch metrics
   - Use AWS Compute Optimizer

2. **Reserved Capacity**
   - RI for predictable workloads
   - Savings Plans for flexibility

3. **Spot Instances**
   - Batch processing
   - Fault-tolerant workloads
   - Use Spot Fleet

4. **Storage Optimization**
   - S3 Intelligent-Tiering
   - Glacier for archival
   - Delete unattached EBS volumes`,
};

export const azureBestPracticesResource = {
  uri: "devops://cloud/azure-best-practices",
  name: "Azure Best Practices",
  description: "Microsoft Azure best practices and patterns",
  mimeType: "text/markdown",
  content: `# Azure Best Practices

## Cloud Adoption Framework

### 1. Strategy
- Define business justification
- Identify expected outcomes
- Business case development

### 2. Plan
- Digital estate assessment
- Initial organizational alignment
- Skills readiness plan
- Cloud adoption plan

### 3. Ready
- Azure landing zones
- Azure setup guide
- Expand the blueprint

### 4. Adopt
- Migrate workloads
- Innovate solutions
- Govern and manage

## Core Services Best Practices

### Virtual Machines
- Use Managed Disks
- Implement Availability Sets/Zones
- Enable Azure Backup
- Use appropriate VM sizes
- Implement Update Management

### Azure App Service
- Use deployment slots
- Enable auto-scaling
- Implement Application Insights
- Use managed identities
- Configure custom domains and SSL

### Azure Kubernetes Service (AKS)
- Use system and user node pools
- Implement Azure CNI for networking
- Enable cluster autoscaler
- Use Azure Active Directory integration
- Implement Azure Policy

### Azure Storage
- Use appropriate storage tier
- Enable soft delete
- Implement lifecycle management
- Use private endpoints
- Enable Azure Defender

### Azure SQL Database
- Use elastic pools for multiple DBs
- Implement geo-replication
- Enable Advanced Threat Protection
- Use automatic tuning
- Implement Query Performance Insights

## Security Best Practices

### Azure Active Directory
- Enable MFA for all users
- Use Conditional Access policies
- Implement Privileged Identity Management
- Regular access reviews
- Use managed identities

### Network Security
\`\`\`
Hub-Spoke Topology:
- Hub VNet: Shared services
- Spoke VNets: Workload isolation
- VNet peering
- Azure Firewall in hub
- Network Security Groups
\`\`\`

### Azure Key Vault
- Separate vaults per environment
- Use managed identities for access
- Enable soft delete
- Implement access policies
- Regular key rotation

## Cost Optimization

### Azure Cost Management
1. **Budgets and Alerts**
   - Set up budgets
   - Configure alerts
   - Review cost recommendations

2. **Right-sizing**
   - Use Azure Advisor
   - Analyze VM utilization
   - Downsize when appropriate

3. **Reserved Instances**
   - 1-year or 3-year commitments
   - Significant discounts
   - VM, SQL, Cosmos DB

4. **Azure Hybrid Benefit**
   - Use existing Windows licenses
   - SQL Server licenses
   - Up to 40% savings

## Monitoring and Logging

### Azure Monitor
- Application Insights for apps
- Log Analytics workspace
- Metric alerts and action groups
- Diagnostic settings enabled

### Best Practices
- Centralized logging
- Alerting strategy
- Dashboard for key metrics
- Regular review of logs`,
};

export const gcpBestPracticesResource = {
  uri: "devops://cloud/gcp-best-practices",
  name: "GCP Best Practices",
  description: "Google Cloud Platform best practices",
  mimeType: "text/markdown",
  content: `# Google Cloud Platform Best Practices

## Architecture Principles

### 1. Scalability
- Use Compute Engine autoscaling
- Cloud Run for containerized apps
- Cloud Functions for event-driven
- GKE for Kubernetes workloads

### 2. Reliability
- Multi-region deployments
- Load balancing
- Health checks
- Disaster recovery planning

### 3. Security
- IAM principle of least privilege
- VPC Service Controls
- Binary Authorization
- Secret Manager

### 4. Performance
- Choose appropriate regions
- Use Cloud CDN
- Implement caching strategies
- Optimize database queries

## Core Services Best Practices

### Compute Engine
- Use instance templates
- Implement managed instance groups
- Use preemptible VMs for batch jobs
- Enable OS Login
- Use custom machine types

### Google Kubernetes Engine (GKE)
- Use Workload Identity
- Enable Binary Authorization
- Implement pod security policies
- Use cluster autoscaling
- Enable GKE monitoring

### Cloud Storage
- Choose appropriate storage class
- Use lifecycle policies
- Enable versioning
- Implement access controls
- Use signed URLs for temporary access

### Cloud SQL
- Enable automated backups
- Use Cloud SQL Proxy
- Implement high availability
- Use read replicas
- Regular maintenance windows

### Cloud Functions
- Keep functions small
- Use environment variables
- Implement proper error handling
- Set appropriate memory
- Use VPC connectors when needed

## Security Best Practices

### IAM
\`\`\`
# Service account best practices
- One service account per service
- Use Workload Identity for GKE
- Rotate service account keys
- Use IAM Conditions for fine-grained access
\`\`\`

### Organization Policies
- Enforce resource constraints
- Restrict service accounts
- VM external IP constraints
- Domain restricted sharing

### VPC Security
- Use VPC Service Controls
- Implement firewall rules
- Use Cloud Armor for DDoS
- Enable VPC Flow Logs
- Private Google Access

## Cost Optimization

### 1. Committed Use Discounts
- 1-year or 3-year commitments
- Up to 57% discount
- Compute Engine resources

### 2. Sustained Use Discounts
- Automatic discounts
- Based on usage patterns
- No upfront commitment

### 3. Preemptible VMs
- Up to 80% discount
- Suitable for batch jobs
- 24-hour maximum runtime

### 4. Resource Optimization
- Right-size VMs
- Use custom machine types
- Delete unused resources
- Use lifecycle policies

## Monitoring and Operations

### Cloud Monitoring (formerly Stackdriver)
- Create custom dashboards
- Set up alerting policies
- Use uptime checks
- Log-based metrics

### Cloud Logging
- Export logs to BigQuery
- Set up log sinks
- Create log-based alerts
- Implement log retention

### Best Practices
- Centralized monitoring
- Proactive alerting
- Regular capacity planning
- Performance baselines`,
};

export const terraformBestPracticesResource = {
  uri: "devops://cloud/terraform-best-practices",
  name: "Terraform Best Practices",
  description: "Infrastructure as Code with Terraform best practices",
  mimeType: "text/markdown",
  content: `# Terraform Best Practices

## Project Structure
\`\`\`
terraform/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
├── modules/
│   ├── vpc/
│   ├── compute/
│   └── database/
├── main.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars
└── backend.tf
\`\`\`

## State Management

### Remote Backend (S3 Example)
\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
\`\`\`

### State Best Practices
- Use remote state
- Enable state locking
- Encrypt state files
- Separate state per environment
- Never commit state files

## Module Design

### Module Structure
\`\`\`hcl
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  
  tags = merge(
    var.tags,
    {
      Name = var.name
    }
  )
}

# modules/vpc/variables.tf
variable "cidr_block" {
  description = "CIDR block for VPC"
  type        = string
}

variable "name" {
  description = "Name of the VPC"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}
\`\`\`

## Best Practices

### 1. Use Variables
\`\`\`hcl
variable "environment" {
  description = "Environment name"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
\`\`\`

### 2. Implement Data Sources
\`\`\`hcl
data "aws_ami" "latest" {
  most_recent = true
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*"]
  }
  
  owners = ["amazon"]
}
\`\`\`

### 3. Use Locals for DRY
\`\`\`hcl
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = var.project_name
  }
}
\`\`\`

### 4. Implement for_each
\`\`\`hcl
resource "aws_instance" "servers" {
  for_each = toset(var.server_names)
  
  ami           = data.aws_ami.latest.id
  instance_type = var.instance_type
  
  tags = merge(
    local.common_tags,
    {
      Name = each.key
    }
  )
}
\`\`\`

### 5. Use count with caution
- Prefer for_each over count
- count is index-based (can cause issues)
- for_each uses keys (more stable)

## Workspace Strategy

\`\`\`bash
# Create workspace
terraform workspace new staging

# Switch workspace
terraform workspace select prod

# List workspaces
terraform workspace list
\`\`\`

## Security Best Practices

1. **Never hardcode secrets**
   - Use variable files
   - Use secret managers
   - Use environment variables

2. **Implement sensitive variables**
\`\`\`hcl
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
\`\`\`

3. **Use .gitignore**
\`\`\`
*.tfstate
*.tfstate.backup
.terraform/
*.tfvars
.terraform.lock.hcl
\`\`\`

## Testing

### Validation
\`\`\`bash
terraform fmt -check
terraform validate
terraform plan
\`\`\`

### Tools
- terraform-compliance
- tflint
- checkov
- terrascan

## CI/CD Integration

\`\`\`yaml
# Example GitLab CI
stages:
  - validate
  - plan
  - apply

validate:
  stage: validate
  script:
    - terraform fmt -check
    - terraform validate

plan:
  stage: plan
  script:
    - terraform plan -out=plan.tfplan
  artifacts:
    paths:
      - plan.tfplan

apply:
  stage: apply
  script:
    - terraform apply plan.tfplan
  when: manual
  only:
    - main
\`\`\``,
};
