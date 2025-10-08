# Kubernetes Workflow Examples

## Example 1: Deploy Application to Kubernetes

```javascript
// Step 1: Generate deployment manifest
{
  "tool": "generate_k8s_manifest",
  "arguments": {
    "resourceType": "deployment",
    "name": "myapp",
    "namespace": "production",
    "options": {
      "replicas": 3,
      "image": "myapp:v1.2.0",
      "port": 8080
    }
  }
}

// Step 2: Generate service manifest
{
  "tool": "generate_k8s_manifest",
  "arguments": {
    "resourceType": "service",
    "name": "myapp",
    "namespace": "production",
    "options": {
      "port": 80,
      "targetPort": 8080,
      "type": "LoadBalancer"
    }
  }
}

// Step 3: Validate manifests
{
  "tool": "validate_k8s_manifest",
  "arguments": {
    "content": "<deployment_yaml_content>"
  }
}

// Step 4: Store deployment info
{
  "tool": "memory_store",
  "arguments": {
    "key": "myapp_deployment",
    "value": {
      "name": "myapp",
      "namespace": "production",
      "replicas": 3,
      "image": "myapp:v1.2.0",
      "version": "v1.2.0"
    },
    "tags": ["kubernetes", "deployment", "production"],
    "category": "kubernetes"
  }
}
```

## Example 2: Create Helm Chart

```javascript
// Generate Helm chart
{
  "tool": "generate_helm_chart",
  "arguments": {
    "chartName": "myapp",
    "appVersion": "1.2.0",
    "description": "My Application Helm Chart"
  }
}

// Store chart info
{
  "tool": "memory_store",
  "arguments": {
    "key": "myapp_helm_chart",
    "value": {
      "name": "myapp",
      "version": "0.1.0",
      "appVersion": "1.2.0",
      "repository": "https://charts.company.com"
    },
    "tags": ["helm", "chart", "myapp"],
    "category": "kubernetes"
  }
}
```

## Example 3: Analyze Existing Resources

```javascript
// Analyze multiple manifests
{
  "tool": "analyze_k8s_resources",
  "arguments": {
    "manifests": [
      "<deployment_yaml>",
      "<service_yaml>",
      "<configmap_yaml>"
    ]
  }
}

// Record optimization decision
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Kubernetes pods being evicted due to memory pressure. No resource limits set.",
    "decision": "Added resource requests and limits to all deployments. Set requests at 80% of typical usage, limits at 150%. Implemented HPA based on CPU >70%. Reduced pod evictions by 95%."
  }
}
```
