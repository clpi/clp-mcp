# Terraform Infrastructure Workflow Examples

## Example 1: Create VPC Module

```javascript
// Step 1: Generate Terraform VPC module
{
  "tool": "generate_terraform_module",
  "arguments": {
    "moduleType": "vpc",
    "provider": "aws",
    "includeVariables": true,
    "includeOutputs": true
  }
}

// Step 2: Validate the module
{
  "tool": "validate_terraform",
  "arguments": {
    "content": "<paste_main_tf_content>"
  }
}

// Step 3: Format the configuration
{
  "tool": "format_terraform",
  "arguments": {
    "content": "<paste_terraform_content>"
  }
}

// Step 4: Store module information
{
  "tool": "memory_store",
  "arguments": {
    "key": "vpc_module_v1",
    "value": {
      "path": "modules/vpc",
      "version": "1.0.0",
      "provider": "aws",
      "resources": ["vpc", "subnets", "nat_gateway", "route_tables"]
    },
    "tags": ["terraform", "module", "vpc", "networking"],
    "category": "terraform"
  }
}
```

## Example 2: Backend Configuration

```javascript
// Generate S3 backend configuration
{
  "tool": "generate_terraform_backend",
  "arguments": {
    "backendType": "s3",
    "config": {
      "bucket": "company-terraform-state",
      "key": "production/vpc/terraform.tfstate",
      "region": "us-east-1",
      "dynamodb_table": "terraform-locks",
      "encrypt": "true"
    }
  }
}

// Store backend config
{
  "tool": "memory_store",
  "arguments": {
    "key": "terraform_backend_prod",
    "value": {
      "backend": "s3",
      "bucket": "company-terraform-state",
      "region": "us-east-1",
      "dynamodb_table": "terraform-locks"
    },
    "tags": ["terraform", "backend", "production"],
    "category": "terraform"
  }
}
```

## Example 3: State Analysis

```javascript
// Analyze current state
{
  "tool": "analyze_terraform_state",
  "arguments": {
    "stateContent": "<paste_terraform_state_json>"
  }
}

// Record infrastructure decision
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "State file growing too large (50+ resources). Plan execution taking >5 minutes.",
    "decision": "Split monolithic state into logical modules: networking, compute, database. Use remote state data sources for cross-module references. Reduced plan time to <1 minute per module."
  }
}
```
