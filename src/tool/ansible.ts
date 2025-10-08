import { z } from "zod";

export const ansibleTools = {
  validatePlaybook: {
    name: "validate_ansible_playbook",
    title: "Validate Ansible Playbook",
    description: "Validate an Ansible playbook for syntax and best practices",
    inputSchema: z.object({
      content: z.string().describe("The playbook YAML content to validate"),
    }),
    handler: async ({ content }: { content: string }) => {
      const issues: string[] = [];
      const warnings: string[] = [];

      // Basic YAML structure checks
      if (!content.includes("hosts:")) {
        issues.push("Missing 'hosts' directive - playbook must specify target hosts");
      }

      if (!content.includes("tasks:") && !content.includes("roles:")) {
        issues.push("Missing 'tasks' or 'roles' - playbook must define actions");
      }

      // Best practices checks
      if (!content.includes("name:")) {
        warnings.push("Tasks should have descriptive names for better readability");
      }

      if (!content.includes("become:") && !content.includes("sudo:")) {
        warnings.push("Consider if privilege escalation (become) is needed");
      }

      if (content.includes("command:") || content.includes("shell:")) {
        warnings.push("Prefer native Ansible modules over command/shell when possible");
      }

      // Security checks
      if (content.includes("password:") && !content.includes("vault")) {
        issues.push("CRITICAL: Potential plaintext password detected - use Ansible Vault");
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
                "Use ansible-lint for comprehensive static analysis",
                "Store secrets in Ansible Vault",
                "Use tags for selective playbook execution",
                "Add handlers for service restarts",
              ],
            }, null, 2),
          }
        ]
      };
    },
  },

  generatePlaybook: {
    name: "generate_ansible_playbook",
    title: "Generate Ansible Playbook",
    description: "Generate an Ansible playbook template based on requirements",
    inputSchema: z.object({
      playbookType: z.enum([
        "webserver",
        "database",
        "docker",
        "kubernetes",
        "security_hardening",
        "user_management",
      ]).describe("Type of playbook to generate"),
      hosts: z.string().describe("Target hosts or group"),
      variables: z.record(z.string()).optional().describe("Variables to include"),
    }),
    handler: async ({ playbookType, hosts, variables }: { 
      playbookType: string; 
      hosts: string; 
      variables?: Record<string, string> 
    }) => {
      const tasks = getPlaybookTasks(playbookType);
      const varsSection = variables && Object.keys(variables).length > 0
        ? `  vars:\n${Object.entries(variables).map(([k, v]) => `    ${k}: ${v}`).join('\n')}\n`
        : '';

      const playbook = `---
- name: ${capitalize(playbookType.replace(/_/g, ' '))} Configuration
  hosts: ${hosts}
  become: yes
${varsSection}
  tasks:
${tasks.map(task => `    - name: ${task.name}
      ${task.module}: ${task.params}`).join('\n\n')}

  handlers:
    - name: restart service
      service:
        name: "{{ service_name }}"
        state: restarted
`;

      return {
        content: [
          {
            type: "text" as const,
            text: playbook,
          }
        ]
      };
    },
  },

  lintPlaybook: {
    name: "lint_ansible_playbook",
    title: "Lint Ansible Playbook",
    description: "Check Ansible playbook for common anti-patterns and style issues",
    inputSchema: z.object({
      content: z.string().describe("The playbook content to lint"),
    }),
    handler: async ({ content }: { content: string }) => {
      const lintResults: Array<{ rule: string; severity: string; message: string }> = [];

      // Check for deprecated modules
      const deprecatedModules = ["include", "raw"];
      deprecatedModules.forEach(mod => {
        if (content.includes(`${mod}:`)) {
          lintResults.push({
            rule: "deprecated-module",
            severity: "warning",
            message: `Module '${mod}' is deprecated`,
          });
        }
      });

      // Check for command without changed_when
      if ((content.includes("command:") || content.includes("shell:")) && 
          !content.includes("changed_when:")) {
        lintResults.push({
          rule: "command-instead-of-module",
          severity: "warning",
          message: "command/shell should have 'changed_when' clause",
        });
      }

      // Check for missing no_log on sensitive tasks
      if ((content.includes("password") || content.includes("secret")) && 
          !content.includes("no_log:")) {
        lintResults.push({
          rule: "no-log-password",
          severity: "error",
          message: "Tasks with passwords should use 'no_log: true'",
        });
      }

      // Check for package without state
      if (content.includes("package:") && !content.includes("state:")) {
        lintResults.push({
          rule: "package-latest",
          severity: "warning",
          message: "Package tasks should explicitly specify 'state'",
        });
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              total_issues: lintResults.length,
              errors: lintResults.filter(r => r.severity === "error").length,
              warnings: lintResults.filter(r => r.severity === "warning").length,
              results: lintResults,
            }, null, 2),
          }
        ]
      };
    },
  },

  generateInventory: {
    name: "generate_ansible_inventory",
    title: "Generate Ansible Inventory",
    description: "Generate an Ansible inventory file",
    inputSchema: z.object({
      format: z.enum(["ini", "yaml"]).describe("Inventory format"),
      groups: z.record(z.array(z.string())).describe("Host groups and their hosts"),
      variables: z.record(z.record(z.string())).optional().describe("Group variables"),
    }),
    handler: async ({ format, groups, variables }: { 
      format: string; 
      groups: Record<string, string[]>; 
      variables?: Record<string, Record<string, string>> 
    }) => {
      let inventory = "";

      if (format === "ini") {
        for (const [group, hosts] of Object.entries(groups)) {
          inventory += `[${group}]\n`;
          hosts.forEach(host => {
            inventory += `${host}\n`;
          });
          inventory += "\n";
        }

        if (variables) {
          for (const [group, vars] of Object.entries(variables)) {
            inventory += `[${group}:vars]\n`;
            for (const [key, value] of Object.entries(vars)) {
              inventory += `${key}=${value}\n`;
            }
            inventory += "\n";
          }
        }
      } else {
        // YAML format
        const yamlObj: any = { all: { children: {} } };
        for (const [group, hosts] of Object.entries(groups)) {
          yamlObj.all.children[group] = { hosts: {} };
          hosts.forEach(host => {
            yamlObj.all.children[group].hosts[host] = {};
          });
          if (variables?.[group]) {
            yamlObj.all.children[group].vars = variables[group];
          }
        }
        inventory = JSON.stringify(yamlObj, null, 2);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: inventory,
          }
        ]
      };
    },
  },
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPlaybookTasks(playbookType: string): Array<{ name: string; module: string; params: string }> {
  const taskTemplates: Record<string, Array<{ name: string; module: string; params: string }>> = {
    webserver: [
      { name: "Install nginx", module: "apt", params: "name=nginx state=present update_cache=yes" },
      { name: "Start nginx service", module: "service", params: "name=nginx state=started enabled=yes" },
      { name: "Copy nginx config", module: "template", params: "src=nginx.conf.j2 dest=/etc/nginx/nginx.conf" },
    ],
    database: [
      { name: "Install PostgreSQL", module: "apt", params: "name=postgresql state=present" },
      { name: "Start PostgreSQL", module: "service", params: "name=postgresql state=started enabled=yes" },
      { name: "Create database", module: "postgresql_db", params: "name={{ db_name }} state=present" },
    ],
    docker: [
      { name: "Install Docker dependencies", module: "apt", params: "name={{ item }} state=present with_items: [apt-transport-https, ca-certificates, curl]" },
      { name: "Add Docker GPG key", module: "apt_key", params: "url=https://download.docker.com/linux/ubuntu/gpg" },
      { name: "Install Docker", module: "apt", params: "name=docker-ce state=present" },
    ],
    kubernetes: [
      { name: "Install kubectl", module: "get_url", params: "url=https://dl.k8s.io/release/stable.txt dest=/usr/local/bin/kubectl mode=0755" },
      { name: "Install kubeadm", module: "apt", params: "name=kubeadm state=present" },
      { name: "Initialize cluster", module: "command", params: "kubeadm init" },
    ],
    security_hardening: [
      { name: "Update all packages", module: "apt", params: "upgrade=dist update_cache=yes" },
      { name: "Install fail2ban", module: "apt", params: "name=fail2ban state=present" },
      { name: "Configure firewall", module: "ufw", params: "rule=allow port=22 proto=tcp" },
    ],
    user_management: [
      { name: "Create user group", module: "group", params: "name={{ group_name }} state=present" },
      { name: "Create user", module: "user", params: "name={{ username }} groups={{ group_name }} state=present" },
      { name: "Set up SSH keys", module: "authorized_key", params: "user={{ username }} key={{ ssh_key }}" },
    ],
  };

  return taskTemplates[playbookType] || [];
}
