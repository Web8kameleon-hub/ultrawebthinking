/**
 * Kubernetes Configuration and Management
 * Web8 Platform - Kameleon.life Integration
 */

import * as k8s from '@kubernetes/client-node'

interface KubernetesConfig {
  namespace: string
  clusterName: string
  kubeConfigPath?: string
  context?: string
}

interface PodMetrics {
  name: string
  namespace: string
  cpuUsage: string
  memoryUsage: string
  status: string
  restartCount: number
  age: string
}

interface ServiceInfo {
  name: string
  namespace: string
  type: string
  clusterIP: string
  externalIP?: string
  ports: Array<{
    name?: string
    port: number
    targetPort: number | string
    protocol: string
  }>
}

class Web8KubernetesManager {
  private kubeConfig: k8s.KubeConfig
  private k8sApi: k8s.CoreV1Api
  private metricsApi: k8s.Metrics
  private config: KubernetesConfig

  constructor(config: KubernetesConfig) {
    this.config = config
    this.kubeConfig = new k8s.KubeConfig()
    
    try {
      if (config.kubeConfigPath) {
        this.kubeConfig.loadFromFile(config.kubeConfigPath)
      } else {
        this.kubeConfig.loadFromDefault()
      }
      
      if (config.context) {
        this.kubeConfig.setCurrentContext(config.context)
      }
      
      this.k8sApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api)
      this.metricsApi = new k8s.Metrics(this.kubeConfig)
    } catch (error) {
      console.error('Failed to initialize Kubernetes client:', error)
      throw new Error('Kubernetes initialization failed')
    }
  }

  async getClusterInfo() {
    try {
      const nodes = await this.k8sApi.listNode()
      const namespaces = await this.k8sApi.listNamespace()
      
      return {
        nodes: (nodes as any).body.items.map((node: any) => ({
          name: node.metadata?.name,
          status: node.status?.conditions?.find((c: any) => c.type === 'Ready')?.status,
          version: node.status?.nodeInfo?.kubeletVersion,
          os: node.status?.nodeInfo?.osImage,
          architecture: node.status?.nodeInfo?.architecture
        })),
        namespaces: (namespaces as any).body.items.map((ns: any) => ns.metadata?.name),
        totalNodes: (nodes as any).body.items.length,
        activeNamespaces: (namespaces as any).body.items.length
      }
    } catch (error) {
      console.error('Failed to get cluster info:', error)
      throw error
    }
  }

  async getPodMetrics(namespace?: string): Promise<PodMetrics[]> {
    try {
      const ns = namespace || this.config.namespace
      const pods = await this.k8sApi.listNamespacedPod({ namespace: ns })
      
      return (pods as any).body.items.map((pod: any) => ({
        name: pod.metadata?.name || 'unknown',
        namespace: pod.metadata?.namespace || ns,
        cpuUsage: 'N/A', // Would need metrics server
        memoryUsage: 'N/A', // Would need metrics server
        status: pod.status?.phase || 'Unknown',
        restartCount: pod.status?.containerStatuses?.[0]?.restartCount || 0,
        age: this.calculateAge(pod.metadata?.creationTimestamp)
      }))
    } catch (error) {
      console.error('Failed to get pod metrics:', error)
      return []
    }
  }

  async getServices(namespace?: string): Promise<ServiceInfo[]> {
    try {
      const ns = namespace || this.config.namespace
      const services = await this.k8sApi.listNamespacedService({ namespace: ns })
      
      return (services as any).body.items.map((service: any) => ({
        name: service.metadata?.name || 'unknown',
        namespace: service.metadata?.namespace || ns,
        type: service.spec?.type || 'ClusterIP',
        clusterIP: service.spec?.clusterIP || '',
        externalIP: service.status?.loadBalancer?.ingress?.[0]?.ip,
        ports: service.spec?.ports?.map((port: any) => ({
          name: port.name,
          port: port.port,
          targetPort: port.targetPort || port.port,
          protocol: port.protocol || 'TCP'
        })) || []
      }))
    } catch (error) {
      console.error('Failed to get services:', error)
      return []
    }
  }

  async deployWeb8Application(appConfig: {
    name: string
    image: string
    replicas: number
    port: number
    env?: Record<string, string>
  }) {
    try {
      const deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: appConfig.name,
          namespace: this.config.namespace
        },
        spec: {
          replicas: appConfig.replicas,
          selector: {
            matchLabels: {
              app: appConfig.name
            }
          },
          template: {
            metadata: {
              labels: {
                app: appConfig.name
              }
            },
            spec: {
              containers: [
                {
                  name: appConfig.name,
                  image: appConfig.image,
                  ports: [
                    {
                      containerPort: appConfig.port
                    }
                  ],
                  env: Object.entries(appConfig.env || {}).map(([name, value]) => ({
                    name,
                    value
                  }))
                }
              ]
            }
          }
        }
      }

      const appsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api)
      const result = await appsApi.createNamespacedDeployment({
        namespace: this.config.namespace,
        body: deployment as any
      })

      return {
        success: true,
        deploymentName: (result as any).body.metadata?.name,
        namespace: (result as any).body.metadata?.namespace
      }
    } catch (error) {
      console.error('Failed to deploy application:', error)
      throw error
    }
  }

  async createService(serviceConfig: {
    name: string
    selector: Record<string, string>
    ports: Array<{
      port: number
      targetPort: number
      protocol?: string
    }>
    type?: string
  }) {
    try {
      const service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name: serviceConfig.name,
          namespace: this.config.namespace
        },
        spec: {
          selector: serviceConfig.selector,
          ports: serviceConfig.ports.map(port => ({
            port: port.port,
            targetPort: port.targetPort,
            protocol: port.protocol || 'TCP'
          })),
          type: serviceConfig.type || 'ClusterIP'
        }
      }

      const result = await this.k8sApi.createNamespacedService({
        namespace: this.config.namespace,
        body: service as any
      })

      return {
        success: true,
        serviceName: (result as any).body.metadata?.name,
        namespace: (result as any).body.metadata?.namespace
      }
    } catch (error) {
      console.error('Failed to create service:', error)
      throw error
    }
  }

  async scaleDeployment(deploymentName: string, replicas: number) {
    try {
      const appsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api)
      
      const patch = [
        {
          op: 'replace',
          path: '/spec/replicas',
          value: replicas
        }
      ]

      const result = await appsApi.patchNamespacedDeployment({
        name: deploymentName,
        namespace: this.config.namespace,
        body: patch as any
      })

      return {
        success: true,
        deploymentName: (result as any).body.metadata?.name,
        replicas: (result as any).body.spec?.replicas
      }
    } catch (error) {
      console.error('Failed to scale deployment:', error)
      throw error
    }
  }

  private calculateAge(creationTimestamp?: Date | string): string {
    if (!creationTimestamp) return 'Unknown'
    
    const created = new Date(creationTimestamp)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  async getResourceUsage() {
    try {
      const pods = await this.getPodMetrics()
      const services = await this.getServices()
      const clusterInfo = await this.getClusterInfo()

      return {
        totalPods: pods.length,
        runningPods: pods.filter(p => p.status === 'Running').length,
        totalServices: services.length,
        clusterNodes: clusterInfo.totalNodes,
        namespaces: clusterInfo.activeNamespaces,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to get resource usage:', error)
      return {
        totalPods: 0,
        runningPods: 0,
        totalServices: 0,
        clusterNodes: 0,
        namespaces: 0,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export for use in other modules
export { Web8KubernetesManager, type KubernetesConfig, type PodMetrics, type ServiceInfo }

// Default configuration for kameleon.life
export const kameleonKubernetesConfig: KubernetesConfig = {
  namespace: 'kameleon-life',
  clusterName: 'web8-kameleon',
  context: 'kameleon-context'
}

// Create default manager instance
export const kubernetesManager = new Web8KubernetesManager(kameleonKubernetesConfig)
