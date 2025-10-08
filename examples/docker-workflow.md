# Docker Workflow Examples

## Example 1: Create Optimized Dockerfile

```javascript
// Step 1: Generate Dockerfile
{
  "tool": "generate_dockerfile",
  "arguments": {
    "projectType": "nodejs",
    "includeMultiStage": true,
    "baseImage": "node:18-alpine"
  }
}

// Step 2: Validate Dockerfile
{
  "tool": "validate_dockerfile",
  "arguments": {
    "content": "<paste_dockerfile_content>"
  }
}

// Step 3: Get optimization suggestions
{
  "tool": "optimize_dockerfile",
  "arguments": {
    "content": "<paste_dockerfile_content>"
  }
}

// Step 4: Store optimized Dockerfile
{
  "tool": "memory_store",
  "arguments": {
    "key": "nodejs_dockerfile_optimized",
    "value": "<final_dockerfile_content>",
    "tags": ["docker", "nodejs", "optimized"],
    "category": "docker"
  }
}
```

## Example 2: Create Docker Compose Stack

```javascript
// Generate docker-compose.yml
{
  "tool": "generate_docker_compose",
  "arguments": {
    "services": [
      {
        "name": "web",
        "type": "app",
        "ports": ["3000:3000"],
        "environment": {
          "NODE_ENV": "production",
          "DATABASE_URL": "postgresql://db:5432/myapp"
        }
      },
      {
        "name": "db",
        "type": "database",
        "ports": ["5432:5432"]
      },
      {
        "name": "redis",
        "type": "cache"
      }
    ],
    "version": "3.8"
  }
}

// Store compose configuration
{
  "tool": "memory_store",
  "arguments": {
    "key": "myapp_docker_compose",
    "value": {
      "services": ["web", "db", "redis"],
      "networks": ["app-network"],
      "volumes": ["db-data", "cache-data"]
    },
    "tags": ["docker", "compose", "myapp"],
    "category": "docker"
  }
}
```

## Example 3: Image Optimization

```javascript
// Record optimization decision
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Docker images too large (800MB average). Slow deployments and high storage costs.",
    "decision": "Implemented multi-stage builds with alpine base images. Added .dockerignore. Reduced image size from 800MB to 120MB (85% reduction). Deploy time reduced from 5min to 45sec."
  }
}

// Store base image standards
{
  "tool": "memory_store",
  "arguments": {
    "key": "docker_base_images",
    "value": {
      "nodejs": "node:18-alpine",
      "python": "python:3.11-slim",
      "nginx": "nginx:1.25-alpine",
      "postgres": "postgres:15-alpine"
    },
    "tags": ["docker", "standards", "base-images"],
    "category": "docker"
  }
}
```
