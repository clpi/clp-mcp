import { z } from "zod";

export const kubernetesTools = {
  validateK8sManifest: {
    name: "validate_k8s_manifest",
    title: "Validate Kubernetes Manifest",
    description: "Validate Kubernetes manifest for syntax and best practices",
    inputSchema: z.object({
      content: z.string().describe("The Kubernetes manifest YAML content to validate"),
    }),
    handler: async ({ content }: { content: string }) => {
      const issues: string[] = [];
      const warnings: string[] = [];

      // Basic structure checks
      if (!content.includes("apiVersion:")) {
        issues.push("Missing 'apiVersion' field");
      }

      if (!content.includes("kind:")) {
        issues.push("Missing 'kind' field");
      }

      if (!content.includes("metadata:")) {
        issues.push("Missing 'metadata' field");
      }

      // Best practices for Deployments
      if (content.includes("kind: Deployment")) {
        if (!content.includes("replicas:")) {
          warnings.push("Consider specifying replica count explicitly");
        }

        if (!content.includes("strategy:")) {
          warnings.push("Consider specifying update strategy");
        }

        if (!content.includes("resources:")) {
          warnings.push("IMPORTANT: Resources (limits/requests) should be defined");
        }

        if (!content.includes("livenessProbe:") || !content.includes("readinessProbe:")) {
          warnings.push("Consider adding liveness and readiness probes");
        }
      }

      // Security checks
      if (content.includes("privileged: true")) {
        issues.push("SECURITY: Privileged containers should be avoided");
      }

      if (content.includes("hostNetwork: true")) {
        warnings.push("SECURITY: Using host network should be carefully considered");
      }

      if (content.includes("image:") && !content.includes("imagePullPolicy:")) {
        warnings.push("Consider specifying imagePullPolicy");
      }

      // Check for image tags
      if (content.match(/image:.*:latest/)) {
        warnings.push("Avoid using 'latest' tag in production");
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
                "Use kubectl apply --dry-run for validation",
                "Set resource limits and requests",
                "Implement health checks",
                "Use ConfigMaps for configuration",
                "Use Secrets for sensitive data",
                "Add labels for organization",
              ],
            }, null, 2),
          }
        ]
      };
    },
  },

  generateK8sManifest: {
    name: "generate_k8s_manifest",
    title: "Generate Kubernetes Manifest",
    description: "Generate a Kubernetes manifest template",
    inputSchema: z.object({
      resourceType: z.enum([
        "deployment",
        "service",
        "configmap",
        "secret",
        "ingress",
        "statefulset",
        "daemonset",
        "job",
        "cronjob",
      ]).describe("Type of Kubernetes resource"),
      name: z.string().describe("Resource name"),
      namespace: z.string().default("default").describe("Namespace"),
      options: z.record(z.any()).optional().describe("Additional options"),
    }),
    handler: async ({ resourceType, name, namespace, options }: {
      resourceType: string;
      name: string;
      namespace: string;
      options?: Record<string, any>;
    }) => {
      const manifest = generateK8sResource(resourceType, name, namespace, options || {});

      return {
        content: [
          {
            type: "text" as const,
            text: manifest,
          }
        ]
      };
    },
  },

  generateHelm: {
    name: "generate_helm_chart",
    title: "Generate Helm Chart",
    description: "Generate a Helm chart structure",
    inputSchema: z.object({
      chartName: z.string().describe("Name of the Helm chart"),
      appVersion: z.string().default("1.0.0").describe("Application version"),
      description: z.string().describe("Chart description"),
    }),
    handler: async ({ chartName, appVersion, description }: {
      chartName: string;
      appVersion: string;
      description: string;
    }) => {
      const chartYaml = `apiVersion: v2
name: ${chartName}
description: ${description}
type: application
version: 0.1.0
appVersion: "${appVersion}"
`;

      const valuesYaml = `# Default values for ${chartName}
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  className: ""
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
`;

      const deploymentYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${chartName}.fullname" . }}
  labels:
    {{- include "${chartName}.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "${chartName}.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "${chartName}.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
`;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              "Chart.yaml": chartYaml,
              "values.yaml": valuesYaml,
              "templates/deployment.yaml": deploymentYaml,
              "templates/_helpers.tpl": generateHelmHelpers(chartName),
            }, null, 2),
          }
        ]
      };
    },
  },

  analyzeK8sResources: {
    name: "analyze_k8s_resources",
    title: "Analyze Kubernetes Resources",
    description: "Analyze Kubernetes resources for optimization opportunities",
    inputSchema: z.object({
      manifests: z.array(z.string()).describe("Array of Kubernetes manifest contents"),
    }),
    handler: async ({ manifests }: { manifests: string[] }) => {
      const analysis = {
        totalResources: manifests.length,
        resourceTypes: new Set<string>(),
        missingResources: [] as string[],
        missingLimits: [] as string[],
        missingProbes: [] as string[],
        securityIssues: [] as string[],
        recommendations: [] as string[],
      };

      manifests.forEach((manifest, idx) => {
        const lines = manifest.split('\n');
        const kind = lines.find(l => l.includes("kind:"))?.split(":")[1]?.trim();
        if (kind) analysis.resourceTypes.add(kind);

        if (!manifest.includes("resources:")) {
          analysis.missingLimits.push(`Resource ${idx + 1}: Missing resource limits`);
        }

        if (manifest.includes("kind: Deployment")) {
          if (!manifest.includes("livenessProbe:")) {
            analysis.missingProbes.push(`Resource ${idx + 1}: Missing liveness probe`);
          }
          if (!manifest.includes("readinessProbe:")) {
            analysis.missingProbes.push(`Resource ${idx + 1}: Missing readiness probe`);
          }
        }

        if (manifest.includes("privileged: true")) {
          analysis.securityIssues.push(`Resource ${idx + 1}: Uses privileged mode`);
        }
      });

      // Check for common missing resources
      if (!Array.from(analysis.resourceTypes).includes("Service")) {
        analysis.missingResources.push("No Service resource found");
      }

      // Generate recommendations
      if (analysis.missingLimits.length > 0) {
        analysis.recommendations.push("Add resource limits to prevent resource exhaustion");
      }

      if (analysis.missingProbes.length > 0) {
        analysis.recommendations.push("Add health probes for better reliability");
      }

      if (analysis.securityIssues.length > 0) {
        analysis.recommendations.push("Review security settings and apply principle of least privilege");
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              ...analysis,
              resourceTypes: Array.from(analysis.resourceTypes),
            }, null, 2),
          }
        ]
      };
    },
  },

  generateKustomization: {
    name: "generate_kustomization",
    title: "Generate Kustomization File",
    description: "Generate a Kustomization file for Kubernetes manifests",
    inputSchema: z.object({
      resources: z.array(z.string()).describe("List of resource files"),
      namespace: z.string().optional().describe("Target namespace"),
      namePrefix: z.string().optional().describe("Name prefix for resources"),
      commonLabels: z.record(z.string()).optional().describe("Common labels"),
    }),
    handler: async ({ resources, namespace, namePrefix, commonLabels }: {
      resources: string[];
      namespace?: string;
      namePrefix?: string;
      commonLabels?: Record<string, string>;
    }) => {
      let kustomization = "apiVersion: kustomize.config.k8s.io/v1beta1\n";
      kustomization += "kind: Kustomization\n\n";

      if (namespace) {
        kustomization += `namespace: ${namespace}\n\n`;
      }

      if (namePrefix) {
        kustomization += `namePrefix: ${namePrefix}-\n\n`;
      }

      if (commonLabels) {
        kustomization += "commonLabels:\n";
        Object.entries(commonLabels).forEach(([key, value]) => {
          kustomization += `  ${key}: ${value}\n`;
        });
        kustomization += "\n";
      }

      kustomization += "resources:\n";
      resources.forEach(resource => {
        kustomization += `  - ${resource}\n`;
      });

      return {
        content: [
          {
            type: "text" as const,
            text: kustomization,
          }
        ]
      };
    },
  },
};

function generateK8sResource(resourceType: string, name: string, namespace: string, options: Record<string, any>): string {
  const templates: Record<string, string> = {
    deployment: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
  namespace: ${namespace}
  labels:
    app: ${name}
spec:
  replicas: ${options.replicas || 1}
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
      - name: ${name}
        image: ${options.image || 'nginx:latest'}
        ports:
        - containerPort: ${options.port || 80}
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: ${options.port || 80}
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: ${options.port || 80}
          initialDelaySeconds: 5
          periodSeconds: 5
`,
    service: `apiVersion: v1
kind: Service
metadata:
  name: ${name}
  namespace: ${namespace}
spec:
  selector:
    app: ${name}
  ports:
  - protocol: TCP
    port: ${options.port || 80}
    targetPort: ${options.targetPort || options.port || 80}
  type: ${options.type || 'ClusterIP'}
`,
    configmap: `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${name}
  namespace: ${namespace}
data:
  # Add your configuration key-value pairs here
  example.property: "value"
`,
    secret: `apiVersion: v1
kind: Secret
metadata:
  name: ${name}
  namespace: ${namespace}
type: Opaque
data:
  # Values must be base64 encoded
  # example: ZXhhbXBsZS12YWx1ZQ==
`,
    ingress: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${name}
  namespace: ${namespace}
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: ${options.host || 'example.com'}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${name}
            port:
              number: ${options.port || 80}
`,
  };

  return templates[resourceType] || `# ${resourceType} template not available`;
}

function generateHelmHelpers(chartName: string): string {
  return `{{/*
Expand the name of the chart.
*/}}
{{- define "${chartName}.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "${chartName}.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "${chartName}.labels" -}}
helm.sh/chart: {{ include "${chartName}.chart" . }}
{{ include "${chartName}.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "${chartName}.selectorLabels" -}}
app.kubernetes.io/name: {{ include "${chartName}.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
`;
}
