# Ansible Workflow Examples

## Example 1: Create and Validate Playbook

```javascript
// Step 1: Generate a webserver playbook
{
  "tool": "generate_ansible_playbook",
  "arguments": {
    "playbookType": "webserver",
    "hosts": "web_servers",
    "variables": {
      "nginx_port": "80",
      "ssl_enabled": "true",
      "domain_name": "example.com"
    }
  }
}

// Step 2: Validate the playbook
{
  "tool": "validate_ansible_playbook",
  "arguments": {
    "content": "<paste_playbook_yaml>"
  }
}

// Step 3: Lint the playbook
{
  "tool": "lint_ansible_playbook",
  "arguments": {
    "content": "<paste_playbook_yaml>"
  }
}

// Step 4: Store playbook info
{
  "tool": "memory_store",
  "arguments": {
    "key": "webserver_playbook_v1",
    "value": {
      "path": "playbooks/webserver.yml",
      "targets": "web_servers",
      "tasks": ["install_nginx", "configure_ssl", "setup_firewall"],
      "version": "1.0.0"
    },
    "tags": ["ansible", "playbook", "webserver"],
    "category": "ansible"
  }
}
```

## Example 2: Generate Inventory

```javascript
// Generate inventory in YAML format
{
  "tool": "generate_ansible_inventory",
  "arguments": {
    "format": "yaml",
    "groups": {
      "webservers": [
        "web1.example.com",
        "web2.example.com",
        "web3.example.com"
      ],
      "databases": [
        "db1.example.com",
        "db2.example.com"
      ],
      "loadbalancers": [
        "lb1.example.com"
      ]
    },
    "variables": {
      "webservers": {
        "ansible_user": "deploy",
        "nginx_worker_processes": "auto"
      },
      "databases": {
        "ansible_user": "dbadmin",
        "postgresql_version": "15"
      }
    }
  }
}

// Store inventory structure
{
  "tool": "memory_store",
  "arguments": {
    "key": "prod_inventory",
    "value": {
      "groups": ["webservers", "databases", "loadbalancers"],
      "total_hosts": 6,
      "environment": "production"
    },
    "tags": ["ansible", "inventory", "production"],
    "category": "ansible"
  }
}
```

## Example 3: Complete Infrastructure Setup

```javascript
// Record infrastructure automation decision
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Managing configuration for 50+ servers across dev, staging, and production. Need consistent setup, easy rollback, and audit trail.",
    "decision": "Implemented Ansible for configuration management. Created role-based playbook structure with separate inventories per environment. Git-based workflow with PR reviews. Ansible Vault for secrets. Dry-run testing in dev before production."
  }
}

// Store playbook catalog
{
  "tool": "memory_store",
  "arguments": {
    "key": "ansible_playbook_catalog",
    "value": {
      "webserver_setup": {
        "path": "playbooks/webserver.yml",
        "description": "Install and configure nginx",
        "targets": "webservers"
      },
      "database_backup": {
        "path": "playbooks/db_backup.yml",
        "description": "Backup PostgreSQL databases",
        "targets": "databases"
      },
      "security_hardening": {
        "path": "playbooks/security.yml",
        "description": "Apply security hardening",
        "targets": "all"
      },
      "user_management": {
        "path": "playbooks/users.yml",
        "description": "Manage user accounts",
        "targets": "all"
      }
    },
    "tags": ["ansible", "catalog", "playbooks"],
    "category": "ansible"
  }
}
```

## Example 4: Security Hardening Playbook

```javascript
// Generate security hardening playbook
{
  "tool": "generate_ansible_playbook",
  "arguments": {
    "playbookType": "security_hardening",
    "hosts": "all",
    "variables": {
      "ssh_port": "22",
      "allowed_ssh_users": "deploy,admin",
      "fail2ban_enabled": "true"
    }
  }
}

// Validate security playbook
{
  "tool": "validate_ansible_playbook",
  "arguments": {
    "content": "<security_playbook_content>"
  }
}

// Record security decision
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Recent security audit identified gaps: outdated packages, weak SSH config, no fail2ban, missing firewall rules.",
    "decision": "Created automated security hardening playbook: updates packages, hardens SSH (key-only auth, no root), installs fail2ban, configures UFW firewall. Scheduled to run weekly via cron. All changes logged and reviewed."
  }
}
```

## Example 5: Database Setup Automation

```javascript
// Generate database playbook
{
  "tool": "generate_ansible_playbook",
  "arguments": {
    "playbookType": "database",
    "hosts": "databases",
    "variables": {
      "db_name": "production",
      "db_username": "app_user",
      "postgresql_version": "15"
    }
  }
}

// Store database configuration
{
  "tool": "memory_store",
  "arguments": {
    "key": "db_ansible_config",
    "value": {
      "playbook": "playbooks/database.yml",
      "roles": ["postgresql", "backup", "monitoring"],
      "databases": {
        "production": {
          "hosts": ["db1.example.com", "db2.example.com"],
          "replication": "streaming",
          "backup_schedule": "daily"
        }
      }
    },
    "tags": ["ansible", "database", "postgresql"],
    "category": "ansible"
  }
}
```
