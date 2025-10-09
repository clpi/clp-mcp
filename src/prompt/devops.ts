import { z } from "zod";

/**
 * DevOps-related prompts for common scenarios
 */

export const infrastructureProvisioningPrompt = {
  name: "infra_provision",
  description: "Generate infrastructure provisioning plan",
  argsSchema: z.object({
    environment: z.enum(["dev", "staging", "production"]).describe("Target environment"),
    platform: z.enum(["aws", "azure", "gcp", "on-premise"]).describe("Target platform"),
    components: z.array(z.string()).describe("Infrastructure components needed (e.g., web-servers, databases, load-balancers)"),
  }),
};

export const cicdPipelinePrompt = {
  name: "cicd_pipeline",
  description: "Generate CI/CD pipeline configuration",
  argsSchema: z.object({
    pipelineTool: z.enum(["jenkins", "github-actions", "gitlab-ci", "azure-devops"]).describe("CI/CD tool"),
    language: z.enum(["java", "nodejs", "python", "go", "dotnet", "ruby"]).describe("Application language/framework"),
    deploymentTarget: z.enum(["kubernetes", "docker", "vm", "serverless"]).describe("Deployment target"),
  }),
};

export const kubernetesDeploymentPrompt = {
  name: "k8s_deployment",
  description: "Generate Kubernetes deployment configuration",
  argsSchema: z.object({
    appName: z.string().describe("Application name"),
    containerImage: z.string().describe("Container image"),
    replicas: z.number().default(3).describe("Number of replicas"),
    exposeService: z.boolean().default(true).describe("Create service to expose the application"),
  }),
};

export const ansiblePlaybookPrompt = {
  name: "ansible_playbook",
  description: "Generate Ansible playbook for common tasks",
  argsSchema: z.object({
    task: z.enum(["web-server-setup", "database-setup", "user-management", "security-hardening", "monitoring-setup"]).describe("Type of task"),
    targetOS: z.enum(["ubuntu", "rhel", "debian", "centos"]).describe("Target operating system"),
    includeRoles: z.boolean().default(true).describe("Use roles for organization"),
  }),
};

export const cloudMigrationPrompt = {
  name: "cloud_migration",
  description: "Generate cloud migration strategy and plan",
  argsSchema: z.object({
    source: z.enum(["on-premise", "aws", "azure", "gcp"]).describe("Source environment"),
    target: z.enum(["aws", "azure", "gcp"]).describe("Target cloud provider"),
    workloadType: z.enum(["web-application", "database", "microservices", "data-analytics"]).describe("Type of workload"),
  }),
};

export const disasterRecoveryPrompt = {
  name: "disaster_recovery",
  description: "Generate disaster recovery plan",
  argsSchema: z.object({
    platform: z.enum(["aws", "azure", "gcp", "on-premise"]).describe("Platform"),
    rto: z.number().describe("Recovery Time Objective in hours"),
    rpo: z.number().describe("Recovery Point Objective in hours"),
    criticality: z.enum(["critical", "high", "medium"]).describe("Workload criticality"),
  }),
};

export const securityAuditPrompt = {
  name: "security_audit",
  description: "Generate security audit checklist and recommendations",
  argsSchema: z.object({
    scope: z.enum(["kubernetes", "cloud-infrastructure", "ansible", "ci-cd"]).describe("Audit scope"),
    complianceFramework: z.enum(["cis", "pci-dss", "hipaa", "soc2", "general"]).optional().describe("Compliance framework"),
  }),
};

// Prompt handlers
export function handleInfrastructureProvisioning(args: z.infer<typeof infrastructureProvisioningPrompt.argsSchema>) {
  const components = args.components.join(", ");
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create an infrastructure provisioning plan for a ${args.environment} environment on ${args.platform}.

The infrastructure should include: ${components}

Please provide:
1. Architecture diagram description
2. Resource specifications for each component
3. Network topology and security groups
4. High availability and scaling strategy
5. Monitoring and logging setup
6. Cost estimation
7. Infrastructure as Code templates (Terraform or CloudFormation)

Consider best practices for ${args.platform} and ensure the design is:
- Scalable and performant
- Secure and compliant
- Cost-optimized
- Highly available
- Well-documented`,
        },
      },
    ],
  };
}

export function handleCICDPipeline(args: z.infer<typeof cicdPipelinePrompt.argsSchema>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create a complete CI/CD pipeline configuration for ${args.pipelineTool}.

Application details:
- Language/Framework: ${args.language}
- Deployment Target: ${args.deploymentTarget}

The pipeline should include:
1. Source code checkout
2. Dependency installation
3. Build process
4. Unit tests
5. Integration tests
6. Code quality checks (linting, security scanning)
7. Build artifact creation
8. Deployment to ${args.deploymentTarget}
9. Post-deployment tests
10. Notifications on success/failure

Include:
- Complete pipeline configuration file
- Environment variables and secrets management
- Multi-stage pipeline (dev, staging, production)
- Rollback strategy
- Best practices for ${args.pipelineTool}`,
        },
      },
    ],
  };
}

export function handleKubernetesDeployment(args: z.infer<typeof kubernetesDeploymentPrompt.argsSchema>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create complete Kubernetes manifests for deploying ${args.appName}.

Requirements:
- Container Image: ${args.containerImage}
- Replicas: ${args.replicas}
- Expose Service: ${args.exposeService}

Please provide:
1. Deployment manifest with:
   - Resource limits and requests
   - Liveness and readiness probes
   - Security context
   - Environment variables (ConfigMap)
   - Secrets management
   
2. Service manifest (${args.exposeService ? "ClusterIP and LoadBalancer options" : "if needed"})

3. ConfigMap for application configuration

4. Horizontal Pod Autoscaler (HPA) configuration

5. Ingress configuration for external access

6. Network Policy for security

7. PodDisruptionBudget for high availability

All manifests should follow Kubernetes best practices and be production-ready.`,
        },
      },
    ],
  };
}

export function handleAnsiblePlaybook(args: z.infer<typeof ansiblePlaybookPrompt.argsSchema>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create an Ansible playbook for ${args.task} on ${args.targetOS}.

${args.includeRoles ? "Use role-based structure for better organization." : "Use a single playbook."}

The playbook should include:
1. Pre-task checks (OS version, prerequisites)
2. Main tasks for ${args.task}
3. Handlers for service restarts
4. Post-task validation
5. Error handling
6. Idempotent tasks
7. Appropriate variables and defaults

Include:
- Complete playbook YAML
- Variable definitions
- Inventory file example
- Tags for selective execution
- Documentation and usage instructions

Ensure the playbook follows Ansible best practices and is:
- Idempotent
- Well-documented
- Error-resilient
- OS-specific where necessary`,
        },
      },
    ],
  };
}

export function handleCloudMigration(args: z.infer<typeof cloudMigrationPrompt.argsSchema>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create a comprehensive cloud migration plan from ${args.source} to ${args.target}.

Workload Type: ${args.workloadType}

The migration plan should include:

1. Assessment Phase:
   - Current architecture analysis
   - Dependencies mapping
   - Resource inventory
   - Performance baselines

2. Migration Strategy:
   - Recommended approach (lift-and-shift, refactor, or hybrid)
   - Phased migration plan
   - Parallel run strategy
   - Rollback procedures

3. Target Architecture:
   - ${args.target} service mapping
   - Network design
   - Security configuration
   - High availability setup

4. Migration Execution:
   - Step-by-step migration tasks
   - Data migration strategy
   - DNS cutover plan
   - Testing approach

5. Post-Migration:
   - Validation checklist
   - Optimization opportunities
   - Monitoring setup
   - Documentation

Include:
- Timeline estimates
- Resource requirements
- Cost analysis
- Risk assessment with mitigation strategies
- Communication plan`,
        },
      },
    ],
  };
}

export function handleDisasterRecovery(args: z.infer<typeof disasterRecoveryPrompt.argsSchema>) {
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create a comprehensive disaster recovery (DR) plan for ${args.platform}.

Requirements:
- RTO (Recovery Time Objective): ${args.rto} hours
- RPO (Recovery Point Objective): ${args.rpo} hours
- Criticality Level: ${args.criticality}

The DR plan should include:

1. Backup Strategy:
   - Backup frequency and retention
   - Backup locations and replication
   - Backup validation and testing
   - Automated backup procedures

2. Recovery Procedures:
   - Step-by-step recovery process
   - Automated vs manual steps
   - Recovery time estimates
   - Dependencies and order of operations

3. Infrastructure:
   - DR site configuration
   - Network connectivity
   - Data replication setup
   - Resource allocation

4. Testing and Validation:
   - DR drill schedule
   - Test scenarios
   - Success criteria
   - Documentation of results

5. Roles and Responsibilities:
   - DR team structure
   - Escalation procedures
   - Communication plan
   - Decision-making authority

6. ${args.platform}-Specific Implementation:
   - Platform-native DR services
   - Configuration examples
   - Cost optimization
   - Best practices

Include detailed runbooks and checklists for each recovery scenario.`,
        },
      },
    ],
  };
}

export function handleSecurityAudit(args: z.infer<typeof securityAuditPrompt.argsSchema>) {
  const compliance = args.complianceFramework ? ` aligned with ${args.complianceFramework.toUpperCase()} framework` : "";
  
  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Create a comprehensive security audit checklist for ${args.scope}${compliance}.

The audit should cover:

1. Access Control:
   - Authentication mechanisms
   - Authorization policies
   - Role-based access control (RBAC)
   - Principle of least privilege
   - Access logs and monitoring

2. Network Security:
   - Network segmentation
   - Firewall rules
   - Network policies
   - Encryption in transit
   - VPN and secure access

3. Data Security:
   - Encryption at rest
   - Data classification
   - Backup encryption
   - Secrets management
   - Data retention policies

4. Configuration Security:
   - Security hardening
   - Vulnerability scanning
   - Patch management
   - Secure defaults
   - Configuration drift detection

5. Monitoring and Logging:
   - Security event logging
   - Log aggregation and analysis
   - Alerting and notifications
   - Incident response procedures
   - Audit trails

6. Compliance Requirements:
   ${args.complianceFramework ? `- ${args.complianceFramework.toUpperCase()} specific controls\n   - Evidence collection\n   - Reporting requirements` : "- General security standards\n   - Industry best practices"}

For each item, provide:
- Current state assessment questions
- Expected security controls
- Remediation steps for gaps
- Priority level (critical, high, medium, low)
- Tools and automation recommendations`,
        },
      },
    ],
  };
}
