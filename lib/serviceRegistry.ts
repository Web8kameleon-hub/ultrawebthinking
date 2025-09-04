/**
 * Service Registry -  Version
 */

export interface ServiceInfo {
  name: string;
  status: 'active' | 'inactive';
  description: string;
}

export interface SystemOverview {
  totalServices: number;
  activeServices: number;
  systemHealth: string;
}

class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, ServiceInfo> = new Map();

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
      ServiceRegistry.instance.initializeServices();
    }
    return ServiceRegistry.instance;
  }

  private initializeServices() {
    this.services.set('search', {
      name: 'Search Service',
      status: 'active',
      description: 'Web search functionality'
    });
    
    this.services.set('translate', {
      name: 'Translation Service', 
      status: 'active',
      description: 'Language translation'
    });
  }

  async queryAllServices(query: string): Promise<Record<string, any>> {
    //  service results
    return {
      search: {
        type: 'search_results',
        data: [
          {
            title: 'EuroMesh Network Documentation',
            content: 'EuroMesh është një sistem i avancuar rrjeti mesh...',
            url: 'https://.com/euromesh'
          }
        ]
      },
      translate: {
        type: 'translation',
        data: {
          originalText: query,
          translatedText: query,
          sourceLanguage: 'sq',
          targetLanguage: 'en'
        }
      }
    };
  }

  getAllServices(): ServiceInfo[] {
    return Array.from(this.services.values());
  }

  getSystemOverview(): SystemOverview {
    const total = this.services.size;
    const active = Array.from(this.services.values()).filter(s => s.status === 'active').length;
    
    return {
      totalServices: total,
      activeServices: active,
      systemHealth: active === total ? 'healthy' : 'degraded'
    };
  }
}

export default ServiceRegistry;
