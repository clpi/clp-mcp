/**
 * Kubernetes knowledge resources
 */

export const kubernetesBestPracticesResource = {
  uri: "devops://kubernetes/best-practices",
  name: "Kubernetes Best Practices",
  description: "Production-ready Kubernetes best practices",
  mimeType: "text/markdown",
  content: `# Kubernetes Best Practices

## Resource Configuration

### 1. Always Define Resource Limits
\`\`\`yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"
\`\`\`

### 2. Use Health Checks
\`\`\`yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
\`\`\`

### 3. Set Security Context
\`\`\`yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: true
\`\`\`

## Deployment Strategies

### Rolling Update (Default)
\`\`\`yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
\`\`\`

### Blue-Green Deployment
Use separate deployments with service selector switch

### Canary Deployment
Use Flagger or manual percentage-based rollout

## Configuration Management

### Use ConfigMaps for Configuration
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432"
  log_level: "info"
\`\`\`

### Use Secrets for Sensitive Data
\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  password: <base64-encoded>
\`\`\`

## Networking

### Network Policies
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
\`\`\`

### Service Types
- **ClusterIP**: Internal cluster access
- **NodePort**: External access via node ports
- **LoadBalancer**: Cloud load balancer
- **ExternalName**: DNS alias

## Best Practices Summary

1. **Labels and Selectors**
   - Use meaningful labels
   - Follow naming conventions
   - Include version information

2. **Namespaces**
   - Separate environments
   - Resource quotas per namespace
   - RBAC policies

3. **Pod Disruption Budgets**
   - Maintain availability during updates
   - Define minimum available pods

4. **Resource Quotas**
   - Prevent resource exhaustion
   - Fair resource allocation

5. **Monitoring and Logging**
   - Use Prometheus for metrics
   - Centralized logging (ELK, Loki)
   - Distributed tracing

6. **Backup and Disaster Recovery**
   - Regular etcd backups
   - Disaster recovery plan
   - Multi-region setup for critical apps`,
};

export const kubernetesManifestPatternsResource = {
  uri: "devops://kubernetes/manifest-patterns",
  name: "Kubernetes Manifest Patterns",
  description: "Common Kubernetes manifest patterns and examples",
  mimeType: "text/markdown",
  content: `# Kubernetes Manifest Patterns

## Complete Application Deployment

### Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
        version: v1
    spec:
      containers:
      - name: web-app
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_url
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: password
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
\`\`\`

### Service
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
\`\`\`

### Ingress
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-app-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-app-service
            port:
              number: 80
\`\`\`

## StatefulSet Pattern
\`\`\`yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: database
  replicas: 3
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
    spec:
      containers:
      - name: postgres
        image: postgres:13
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
\`\`\`

## CronJob Pattern
\`\`\`yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-job
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:latest
            command: ["/backup.sh"]
          restartPolicy: OnFailure
\`\`\``,
};

export const kubernetesSecurityResource = {
  uri: "devops://kubernetes/security",
  name: "Kubernetes Security",
  description: "Security best practices for Kubernetes clusters",
  mimeType: "text/markdown",
  content: `# Kubernetes Security Best Practices

## Pod Security

### Pod Security Standards
1. **Privileged**: Unrestricted (not recommended)
2. **Baseline**: Minimally restrictive
3. **Restricted**: Heavily restricted (recommended)

### Security Context Example
\`\`\`yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 2000
  seccompProfile:
    type: RuntimeDefault
  capabilities:
    drop:
      - ALL
    add:
      - NET_BIND_SERVICE
\`\`\`

## RBAC (Role-Based Access Control)

### Role Definition
\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
\`\`\`

### RoleBinding
\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-service-account
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

## Network Security

### Network Policy - Deny All
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
\`\`\`

### Network Policy - Allow Specific
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
\`\`\`

## Secret Management

### Encrypted Secrets at Rest
- Enable encryption at rest in etcd
- Use external secret management (HashiCorp Vault, AWS Secrets Manager)

### Secret Usage
\`\`\`yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-secret
      key: password
\`\`\`

## Image Security

1. **Use Official Images**
   - Verify image sources
   - Use trusted registries

2. **Scan for Vulnerabilities**
   - Integrate image scanning in CI/CD
   - Use tools like Trivy, Clair

3. **Image Pull Policies**
   - Use specific tags, not 'latest'
   - Implement image pull secrets

## Security Checklist

- [ ] Enable RBAC
- [ ] Use Network Policies
- [ ] Implement Pod Security Standards
- [ ] Encrypt secrets at rest
- [ ] Enable audit logging
- [ ] Use security contexts
- [ ] Scan container images
- [ ] Regular security updates
- [ ] Restrict API access
- [ ] Monitor and alert on security events`,
};

export const kubernetesHelmResource = {
  uri: "devops://kubernetes/helm",
  name: "Helm Best Practices",
  description: "Best practices for Helm chart development",
  mimeType: "text/markdown",
  content: `# Helm Best Practices

## Chart Structure
\`\`\`
mychart/
├── Chart.yaml           # Chart metadata
├── values.yaml          # Default values
├── charts/              # Chart dependencies
├── templates/           # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── _helpers.tpl    # Template helpers
│   └── NOTES.txt       # Post-install notes
└── README.md
\`\`\`

## Chart.yaml
\`\`\`yaml
apiVersion: v2
name: myapp
description: A Helm chart for MyApp
type: application
version: 1.0.0
appVersion: "1.0"
dependencies:
  - name: postgresql
    version: "11.x.x"
    repository: "https://charts.bitnami.com/bitnami"
\`\`\`

## values.yaml Best Practices
\`\`\`yaml
# Use clear hierarchical structure
replicaCount: 3

image:
  repository: myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

# Provide sensible defaults
autoscaling:
  enabled: false
  minReplicas: 2
  maxReplicas: 10
\`\`\`

## Template Best Practices

### Use Helper Functions (_helpers.tpl)
\`\`\`yaml
{{- define "mychart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mychart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
\`\`\`

### Deployment Template
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mychart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mychart.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
\`\`\`

## Helm Commands

### Install/Upgrade
\`\`\`bash
helm install myapp ./mychart
helm upgrade myapp ./mychart
helm upgrade --install myapp ./mychart
\`\`\`

### Testing
\`\`\`bash
helm lint ./mychart
helm template myapp ./mychart
helm test myapp
\`\`\`

### Debugging
\`\`\`bash
helm get values myapp
helm get manifest myapp
helm history myapp
\`\`\`

## Best Practices Summary

1. **Use semantic versioning**
2. **Document all values in values.yaml**
3. **Provide NOTES.txt for post-install instructions**
4. **Use conditionals for optional features**
5. **Validate input with required and fail functions**
6. **Keep templates DRY with helpers**
7. **Test charts thoroughly**
8. **Use chart dependencies for complex apps**`,
};
