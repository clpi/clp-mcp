/**
 * Jenkins knowledge resources
 */

export const jenkinsPipelineBestPracticesResource = {
  uri: "devops://jenkins/pipeline-best-practices",
  name: "Jenkins Pipeline Best Practices",
  description: "Best practices for Jenkins declarative and scripted pipelines",
  mimeType: "text/markdown",
  content: `# Jenkins Pipeline Best Practices

## Declarative Pipeline Structure
\`\`\`groovy
pipeline {
    agent any
    
    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    environment {
        DEPLOY_ENV = 'staging'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'mvn test'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'mvn verify'
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh'
            }
        }
    }
    
    post {
        always {
            junit '**/target/surefire-reports/*.xml'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
\`\`\`

## Best Practices

### 1. Use Declarative Syntax
- More structured and easier to understand
- Better validation and error messages
- Easier to maintain

### 2. Define Agent Appropriately
- Use specific agents for different stages
- Leverage Docker agents for consistency
- Consider resource requirements

### 3. Implement Proper Timeouts
- Set global timeout in options
- Add stage-specific timeouts
- Prevent hanging builds

### 4. Use Credentials Securely
- Never hardcode credentials
- Use Jenkins credential store
- Use withCredentials block

### 5. Parallel Execution
- Run independent stages in parallel
- Optimize build time
- Be aware of resource constraints

### 6. Proper Error Handling
- Use post blocks
- Implement try-catch in scripted pipelines
- Provide meaningful error messages

### 7. Artifact Management
- Archive important artifacts
- Clean up workspace
- Use appropriate artifact retention

### 8. Notifications
- Implement proper notifications
- Alert on failures
- Provide build status visibility`,
};

export const jenkinsSharedLibrariesResource = {
  uri: "devops://jenkins/shared-libraries",
  name: "Jenkins Shared Libraries",
  description: "Guide to creating and using Jenkins shared libraries",
  mimeType: "text/markdown",
  content: `# Jenkins Shared Libraries

## Library Structure
\`\`\`
(root)
+- src/                     # Groovy source files
|   +- org/
|       +- example/
|           +- MyClass.groovy
+- vars/                    # Global variables
|   +- buildApp.groovy
|   +- deployApp.groovy
+- resources/              # Resource files
    +- org/
        +- example/
            +- template.json
\`\`\`

## Global Variable Example (vars/buildApp.groovy)
\`\`\`groovy
def call(Map config) {
    pipeline {
        agent any
        stages {
            stage('Build') {
                steps {
                    echo "Building ${config.appName}"
                    sh "${config.buildCommand}"
                }
            }
        }
    }
}
\`\`\`

## Usage in Jenkinsfile
\`\`\`groovy
@Library('my-shared-library@main') _

buildApp(
    appName: 'my-app',
    buildCommand: 'mvn clean package'
)
\`\`\`

## Class-Based Library (src/org/example/MyClass.groovy)
\`\`\`groovy
package org.example

class Builder {
    def script
    
    Builder(script) {
        this.script = script
    }
    
    def build(String language) {
        switch(language) {
            case 'java':
                script.sh 'mvn clean package'
                break
            case 'nodejs':
                script.sh 'npm run build'
                break
        }
    }
}
\`\`\`

## Best Practices
1. Version your shared libraries
2. Document all functions
3. Test library code
4. Use semantic versioning
5. Keep libraries focused
6. Provide examples`,
};

export const jenkinsPluginsResource = {
  uri: "devops://jenkins/essential-plugins",
  name: "Essential Jenkins Plugins",
  description: "Must-have Jenkins plugins for modern CI/CD",
  mimeType: "text/markdown",
  content: `# Essential Jenkins Plugins

## Core Plugins

### Pipeline Plugins
- **Pipeline**: Core pipeline functionality
- **Pipeline: Stage View**: Visualize pipeline stages
- **Pipeline: Multibranch**: Multi-branch pipeline support
- **Pipeline: GitHub Groovy Libraries**: GitHub library integration

### SCM Integration
- **Git**: Git repository integration
- **GitHub**: GitHub integration and webhooks
- **GitHub Branch Source**: GitHub branch discovery
- **Bitbucket**: Bitbucket integration

### Build Tools
- **Maven Integration**: Maven build support
- **Gradle**: Gradle build support
- **NodeJS**: Node.js installation and build
- **Docker Pipeline**: Docker integration

### Quality & Security
- **SonarQube Scanner**: Code quality analysis
- **JUnit**: Test result visualization
- **Code Coverage API**: Code coverage reporting
- **OWASP Dependency-Check**: Security scanning

### Deployment
- **Kubernetes**: Kubernetes deployment
- **Amazon EC2**: AWS EC2 integration
- **Azure VM Agents**: Azure integration
- **SSH Agent**: SSH key management

### Notifications
- **Email Extension**: Advanced email notifications
- **Slack Notification**: Slack integration
- **Discord Notifier**: Discord webhooks

### Utilities
- **Credentials Binding**: Secure credential management
- **Workspace Cleanup**: Workspace management
- **Timestamper**: Add timestamps to console
- **AnsiColor**: Color console output
- **Build Timeout**: Build timeout management

## Plugin Configuration Best Practices
1. Keep plugins updated
2. Remove unused plugins
3. Use plugin compatibility checker
4. Test plugins in staging first
5. Document plugin dependencies`,
};
