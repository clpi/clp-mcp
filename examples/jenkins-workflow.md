# Jenkins Pipeline Workflow Examples

## Example 1: Generate and Validate Pipeline

```javascript
// Step 1: Generate a Jenkins pipeline for Node.js project
{
  "tool": "generate_jenkinsfile",
  "arguments": {
    "projectType": "nodejs",
    "stages": ["build", "test", "security-scan", "deploy"],
    "agent": "docker"
  }
}

// Step 2: Validate the generated pipeline
{
  "tool": "validate_jenkinsfile",
  "arguments": {
    "content": "<paste_generated_jenkinsfile_here>"
  }
}

// Step 3: Analyze for optimization
{
  "tool": "analyze_jenkins_pipeline",
  "arguments": {
    "content": "<paste_jenkinsfile_here>"
  }
}

// Step 4: Store the pipeline in memory
{
  "tool": "memory_store",
  "arguments": {
    "key": "nodejs_pipeline_v1",
    "value": "<jenkinsfile_content>",
    "tags": ["jenkins", "nodejs", "template"],
    "category": "jenkins"
  }
}
```

## Example 2: Multi-Project Pipeline Generation

```javascript
// Generate pipelines for different project types
const projectTypes = ["nodejs", "python", "java", "docker"];

projectTypes.forEach(type => {
  // Generate pipeline
  {
    "tool": "generate_jenkinsfile",
    "arguments": {
      "projectType": type,
      "stages": ["build", "test", "deploy"],
      "agent": "any"
    }
  }
  
  // Store for reference
  {
    "tool": "memory_store",
    "arguments": {
      "key": `${type}_pipeline_template`,
      "value": "<generated_content>",
      "tags": ["jenkins", "template", type],
      "category": "jenkins"
    }
  }
});
```

## Example 3: Pipeline Migration

```javascript
// Record reasoning for pipeline changes
{
  "tool": "add_reasoning",
  "arguments": {
    "context": "Migrating from freestyle jobs to declarative pipelines. Need consistency across 30+ projects.",
    "decision": "Created shared library with standardized pipeline templates. Each project uses declarative syntax calling shared functions. Enables centralized updates and consistent practices."
  }
}
```
