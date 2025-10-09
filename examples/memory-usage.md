# Memory System Usage Examples

This document demonstrates how to use the memory system for DevOps workflows.

## Example 1: Infrastructure Context Management

### Storing Infrastructure Information

```javascript
// Store VPC information
{
  "tool": "memory_store",
  "arguments": {
    "key": "prod_vpc",
    "value": {
      "vpc_id": "vpc-0abc123def456",
      "cidr": "10.0.0.0/16",
      "region": "us-east-1",
      "subnets": {
        "public": ["subnet-1", "subnet-2"],
        "private": ["subnet-3", "subnet-4"]
      }
    },
    "tags": ["production", "networking", "aws"],
    "category": "terraform"
  }
}
```

### Recalling Information

```javascript
// Recall specific VPC info
{
  "tool": "memory_recall",
  "arguments": {
    "key": "prod_vpc"
  }
}
```

### Searching Memory

```javascript
// Find all production resources
{
  "tool": "memory_search",
  "arguments": {
    "query": "production"
  }
}
```

## Example 2: Tracking Deployment Decisions

```javascript
// Record architecture decision
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Evaluating container orchestration options for microservices deployment.",
    "decision": "Selected Amazon EKS over ECS for better portability and K8s ecosystem."
  }
}

// Get recent reasoning
{
  "tool": "get_reasoning_history",
  "arguments": {
    "limit": 10
  }
}
```

See DEVOPS_TOOLS.md for complete documentation.
