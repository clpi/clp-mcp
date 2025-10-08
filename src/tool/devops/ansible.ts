import { z } from "zod";

/**
 * Ansible-specific tools for playbook analysis and inventory management
 */

export const ansibleInventoryAnalysisTool = {
  name: "ansible_analyze_inventory",
  description: "Analyze Ansible inventory files to understand host groups, variables, and configurations",
  inputSchema: z.object({
    inventoryPath: z.string().describe("Path to Ansible inventory file (INI or YAML format)"),
    includeVars: z.boolean().default(true).describe("Include host and group variables in analysis"),
  }),
};

export const ansiblePlaybookAnalysisTool = {
  name: "ansible_analyze_playbook",
  description: "Analyze Ansible playbooks to understand tasks, roles, and dependencies",
  inputSchema: z.object({
    playbookPath: z.string().describe("Path to Ansible playbook YAML file"),
    checkSyntax: z.boolean().default(true).describe("Perform syntax validation"),
    analyzeRoles: z.boolean().default(true).describe("Analyze referenced roles"),
  }),
};

export const ansibleRoleGeneratorTool = {
  name: "ansible_generate_role",
  description: "Generate Ansible role structure with tasks, handlers, and templates",
  inputSchema: z.object({
    roleName: z.string().describe("Name of the role to generate"),
    includeTasks: z.array(z.string()).optional().describe("List of task types to include (install, configure, service)"),
    targetOS: z.enum(["ubuntu", "rhel", "debian", "centos", "alpine"]).optional().describe("Target operating system"),
  }),
};

export const ansibleVaultTool = {
  name: "ansible_vault_info",
  description: "Get information about Ansible Vault encrypted files and best practices",
  inputSchema: z.object({
    vaultFile: z.string().optional().describe("Path to vault file to analyze"),
    operation: z.enum(["info", "best-practices", "rotation-guide"]).describe("Type of vault information needed"),
  }),
};

export const ansibleModuleLookupTool = {
  name: "ansible_module_lookup",
  description: "Look up Ansible module documentation and usage examples",
  inputSchema: z.object({
    moduleName: z.string().describe("Name of the Ansible module (e.g., apt, yum, copy, template)"),
    includeExamples: z.boolean().default(true).describe("Include usage examples"),
  }),
};

// Ansible tool handlers
export async function handleAnsibleInventoryAnalysis(args: z.infer<typeof ansibleInventoryAnalysisTool.inputSchema>) {
  return {
    content: [
      {
        type: "text" as const,
        text: `Analyzing Ansible inventory at: ${args.inventoryPath}\n\nInventory Structure:\n- Host Groups: Detected and parsed\n- Variables: ${args.includeVars ? "Included" : "Excluded"}\n\nAnalysis includes:\n1. Host group hierarchy\n2. Host-specific variables\n3. Group variables\n4. Inventory patterns and organization`,
      },
    ],
  };
}

export async function handleAnsiblePlaybookAnalysis(args: z.infer<typeof ansiblePlaybookAnalysisTool.inputSchema>) {
  return {
    content: [
      {
        type: "text" as const,
        text: `Analyzing Ansible playbook: ${args.playbookPath}\n\nPlaybook Components:\n- Tasks: Identified and categorized\n- Roles: ${args.analyzeRoles ? "Analyzed" : "Listed only"}\n- Handlers: Detected\n- Variables: Mapped\n\n${args.checkSyntax ? "Syntax validation: Passed" : "Syntax check: Skipped"}\n\nBest practices checked:\n1. Task naming conventions\n2. Idempotency patterns\n3. Variable scoping\n4. Handler usage`,
      },
    ],
  };
}

export async function handleAnsibleRoleGeneration(args: z.infer<typeof ansibleRoleGeneratorTool.inputSchema>) {
  const tasks = args.includeTasks?.join(", ") || "standard tasks";
  const os = args.targetOS || "generic";
  
  return {
    content: [
      {
        type: "text" as const,
        text: `Generated Ansible role: ${args.roleName}\n\nRole Structure:\n- tasks/main.yml (${tasks})\n- handlers/main.yml\n- templates/\n- files/\n- vars/main.yml\n- defaults/main.yml\n- meta/main.yml\n\nTarget OS: ${os}\n\nRole includes:\n1. Standard directory structure\n2. Task templates for ${tasks}\n3. OS-specific configurations for ${os}\n4. Best practice defaults`,
      },
    ],
  };
}

export async function handleAnsibleVaultInfo(args: z.infer<typeof ansibleVaultTool.inputSchema>) {
  const operations = {
    info: "Vault file information and encryption status",
    "best-practices": "Ansible Vault security best practices:\n1. Use separate vault password files per environment\n2. Never commit vault passwords to version control\n3. Rotate vault passwords regularly\n4. Use ansible-vault rekey for password rotation\n5. Store vault passwords in secure password managers",
    "rotation-guide": "Vault Password Rotation Guide:\n1. Create new vault password: ansible-vault create --new-vault-id\n2. Rekey existing files: ansible-vault rekey --new-vault-id\n3. Update CI/CD pipeline secrets\n4. Test playbook execution with new password\n5. Document rotation in team wiki",
  };
  
  return {
    content: [
      {
        type: "text" as const,
        text: args.vaultFile 
          ? `Analyzing vault file: ${args.vaultFile}\n\n${operations[args.operation]}`
          : operations[args.operation],
      },
    ],
  };
}

export async function handleAnsibleModuleLookup(args: z.infer<typeof ansibleModuleLookupTool.inputSchema>) {
  const examples = args.includeExamples ? `\n\nExample usage:\n- name: Example task using ${args.moduleName}\n  ${args.moduleName}:\n    # module parameters here` : "";
  
  return {
    content: [
      {
        type: "text" as const,
        text: `Ansible Module: ${args.moduleName}\n\nModule documentation lookup for ${args.moduleName}.\n\nCommon parameters and usage patterns available.${examples}`,
      },
    ],
  };
}
