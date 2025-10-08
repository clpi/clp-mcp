/**
 * Ansible knowledge resources
 */

export const ansibleBestPracticesResource = {
  uri: "devops://ansible/best-practices",
  name: "Ansible Best Practices",
  description: "Comprehensive guide to Ansible best practices",
  mimeType: "text/markdown",
  content: `# Ansible Best Practices

## Directory Structure
\`\`\`
ansible/
├── inventories/
│   ├── production/
│   │   ├── hosts
│   │   └── group_vars/
│   └── staging/
├── roles/
│   └── common/
│       ├── tasks/
│       ├── handlers/
│       ├── templates/
│       ├── files/
│       └── defaults/
├── playbooks/
└── ansible.cfg
\`\`\`

## Best Practices

### 1. Idempotency
- Always design tasks to be idempotent
- Use appropriate modules (avoid shell/command when possible)
- Test tasks multiple times

### 2. Variables
- Use group_vars and host_vars for variable organization
- Avoid hardcoding values
- Use variable precedence wisely

### 3. Role Design
- Keep roles focused and single-purpose
- Use role dependencies appropriately
- Document role requirements

### 4. Security
- Use Ansible Vault for sensitive data
- Never commit secrets to version control
- Rotate vault passwords regularly

### 5. Task Organization
- Name all tasks descriptively
- Use tags for selective execution
- Group related tasks logically

### 6. Error Handling
- Use failed_when and changed_when
- Implement proper error handling with blocks
- Add retries for flaky operations

### 7. Performance
- Use async for long-running tasks
- Minimize fact gathering when not needed
- Use strategy plugins appropriately`,
};

export const ansibleModulesResource = {
  uri: "devops://ansible/modules",
  name: "Common Ansible Modules",
  description: "Reference for frequently used Ansible modules",
  mimeType: "text/markdown",
  content: `# Common Ansible Modules

## Package Management
- **apt**: Debian/Ubuntu package management
- **yum**: RedHat/CentOS package management
- **dnf**: Modern Fedora package management
- **package**: Generic package management

## File Operations
- **copy**: Copy files to remote hosts
- **template**: Process Jinja2 templates
- **file**: Manage file properties
- **lineinfile**: Modify single lines in files
- **blockinfile**: Insert/update blocks of text

## Service Management
- **service**: Manage services (generic)
- **systemd**: Manage systemd services
- **docker_container**: Manage Docker containers

## User Management
- **user**: Manage user accounts
- **group**: Manage groups
- **authorized_key**: Manage SSH keys

## Cloud Modules
- **ec2**: AWS EC2 instances
- **azure_rm_virtualmachine**: Azure VMs
- **gcp_compute_instance**: GCP instances

## Database
- **mysql_db**: MySQL database management
- **postgresql_db**: PostgreSQL database management
- **mongodb_user**: MongoDB user management`,
};

export const ansiblePlaybookPatternsResource = {
  uri: "devops://ansible/playbook-patterns",
  name: "Ansible Playbook Patterns",
  description: "Common playbook patterns and examples",
  mimeType: "text/markdown",
  content: `# Ansible Playbook Patterns

## Basic Playbook Structure
\`\`\`yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    http_port: 80
  
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
    
    - name: Start nginx service
      service:
        name: nginx
        state: started
        enabled: yes
\`\`\`

## Multi-Play Playbook
\`\`\`yaml
---
- name: Configure database servers
  hosts: databases
  roles:
    - postgresql

- name: Configure application servers
  hosts: appservers
  roles:
    - app
    - monitoring
\`\`\`

## Using Handlers
\`\`\`yaml
tasks:
  - name: Update nginx config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: restart nginx

handlers:
  - name: restart nginx
    service:
      name: nginx
      state: restarted
\`\`\`

## Conditional Execution
\`\`\`yaml
- name: Install on Ubuntu
  apt:
    name: package
    state: present
  when: ansible_distribution == "Ubuntu"
\`\`\`

## Loops
\`\`\`yaml
- name: Install multiple packages
  apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - postgresql
    - redis
\`\`\``,
};
