/**
 * DevOps resources index - exports all DevOps knowledge resources
 */

// Ansible resources
export {
  ansibleBestPracticesResource,
  ansibleModulesResource,
  ansiblePlaybookPatternsResource,
} from "./ansible";

// Jenkins resources
export {
  jenkinsPipelineBestPracticesResource,
  jenkinsSharedLibrariesResource,
  jenkinsPluginsResource,
} from "./jenkins";

// Kubernetes resources
export {
  kubernetesBestPracticesResource,
  kubernetesManifestPatternsResource,
  kubernetesSecurityResource,
  kubernetesHelmResource,
} from "./kubernetes";

// Cloud resources
export {
  awsBestPracticesResource,
  azureBestPracticesResource,
  gcpBestPracticesResource,
  terraformBestPracticesResource,
} from "./cloud";
