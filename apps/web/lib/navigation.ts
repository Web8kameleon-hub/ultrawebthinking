/**
 * EuroWeb Platform - Component Navigation & Path Registry
 * Centralized registry for all platform components and their paths
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 3.0.0 Ultra
 * @license MIT
 * @created August 25, 2025
 */

// Component registry with paths and metadata
export const COMPONENT_REGISTRY = {
  // Core UI Components
  ui: {
    loading: {
      path: '@/loading',
      component: 'LoadingSpinner',
      description: 'Universal loading spinner component'
    },
    input: {
      path: '@/components/ui/Input',
      component: 'Input',
      description: 'Enhanced input component'
    },
    modal: {
      path: '@/components/ui/Modal',
      component: 'Modal',
      description: 'Universal modal component'
    },
    errorBoundary: {
      path: '@/components/ui/ErrorBoundary',
      component: 'ErrorBoundary',
      description: 'Error boundary wrapper'
    }
  },

  // AGI Office Suite
  agiOffice: {
    excelEngine: {
      path: '@/agi-office/AGIExcelEngine',
      component: 'AGIExcelEngine',
      description: 'Advanced spreadsheet engine with AI'
    },
    docOffice: {
      path: '@/agi-office/AGIDocOffice',
      component: 'AGIDocOffice',
      description: 'Document editor with real-time collaboration'
    },
    sheetOffice: {
      path: '@/agi-office/AGISheetOffice',
      component: 'AGISheetOffice',
      description: 'Spreadsheet office with advanced formulas'
    }
  },

  // Location & Networking
  location: {
    configDemo: {
      path: '@/location',
      component: 'LocationConfigDemo',
      description: 'Station location configuration demo'
    }
  },

  // Tab System
  tabs: {
    modernSystem: {
      path: '@/modern-tabs',
      component: 'ModernWeb8TabSystem',
      description: 'Modern tab system with AI and enhanced UX'
    },
    web8System: {
      path: '@/components/Web8TabSystem-fixed',
      component: 'Web8TabSystemFixed',
      description: 'Main tab system for the platform'
    }
  },

  // AGI Sheet Components
  agiSheet: {
    medUltra: {
      path: '@/components/AGISheet/AGIMedUltra',
      component: 'AGIMedUltra',
      description: 'Medical AGI component'
    },
    officeUltra: {
      path: '@/components/AGISheet/AGIOfficeUltra',
      component: 'AGIOfficeUltra',
      description: 'Office AGI component'
    },
    ecoUltra: {
      path: '@/components/AGISheet/AGIEcoUltra',
      component: 'AGIEcoUltra',
      description: 'Eco AGI component'
    },
    elUltra: {
      path: '@/components/AGISheet/AGIElUltra',
      component: 'AGIElUltra',
      description: 'Electronic AGI component'
    },
    coreUltra: {
      path: '@/components/AGISheet/AGICoreUltra',
      component: 'AGICoreUltra',
      description: 'Core AGI component'
    },
    projectManager: {
      path: '@/components/AGISheet/ProjectManagerUltra',
      component: 'ProjectManagerUltra',
      description: 'Project management AGI component'
    }
  },

  // Monitoring & Security
  monitoring: {
    guardian: {
      path: '@/components/GuardianMonitor',
      component: 'GuardianMonitor',
      description: 'System monitoring and security'
    }
  },

  // Settings
  settings: {
    main: {
      path: '@/components/settings/Settings',
      component: 'Settings',
      description: 'Platform settings component'
    }
  }
} as const

// Library registry with paths and metadata
export const LIBRARY_REGISTRY = {
  // AGI Office Types & Utils
  agiOffice: {
    types: {
      path: '@/agi-office/types',
      description: 'AGI Office type definitions'
    },
    index: {
      path: '@/agi-office',
      description: 'AGI Office main library'
    }
  },

  // Station & Location Management
  station: {
    config: {
      path: '@/station-config',
      description: 'Station location configuration'
    },
    manager: {
      path: '@/station-config',
      export: 'stationLocationManager',
      description: 'Station location manager instance'
    }
  },

  // Mesh Networking
  mesh: {
    network: {
      path: '@/mesh-network',
      description: 'Mesh networking system'
    },
    instance: {
      path: '@/mesh-network',
      export: 'meshNetwork',
      description: 'Mesh network instance'
    }
  },

  // Configuration
  config: {
    all: {
      path: '@/lib/config/*',
      description: 'All configuration files'
    }
  },

  // Utilities
  utils: {
    all: {
      path: '@/lib/utils/*',
      description: 'Utility functions'
    }
  }
} as const

// Path alias registry
export const PATH_ALIASES = {
  // Main directories
  '@/components': './components',
  '@/lib': './lib',
  '@/utils': './utils',
  '@/types': './types',
  '@/hooks': './hooks',
  '@/styles': './styles',

  // Our specific aliases
  '@/agi-office': './components/agi-office',
  '@/location': './components/LocationConfigDemo',
  '@/station-config': './lib/config/station-location-config',
  '@/mesh-network': './lib/mesh/mesh-networking',
  '@/loading': './components/LoadingSpinner'
} as const

// Helper functions
export function getComponentPath(category: keyof typeof COMPONENT_REGISTRY, component: string) {
  const cat = COMPONENT_REGISTRY[category] as any
  return cat[component]?.path ?? null
}

export function getLibraryPath(category: keyof typeof LIBRARY_REGISTRY, lib: string) {
  const cat = LIBRARY_REGISTRY[category] as any
  return cat[lib]?.path ?? null
}

export function getAllComponentPaths() {
  const paths: string[] = []
  
  Object.values(COMPONENT_REGISTRY).forEach(category => {
    Object.values(category).forEach(comp => {
      paths.push(comp.path)
    })
  })
  
  return paths
}

export function getAllLibraryPaths() {
  const paths: string[] = []
  
  Object.values(LIBRARY_REGISTRY).forEach(category => {
    Object.values(category).forEach(lib => {
      paths.push(lib.path)
    })
  })
  
  return paths
}

// Export summary for documentation
export const PROJECT_SUMMARY = {
  totalComponents: Object.values(COMPONENT_REGISTRY).reduce((acc, cat) => acc + Object.keys(cat).length, 0),
  totalLibraries: Object.values(LIBRARY_REGISTRY).reduce((acc, cat) => acc + Object.keys(cat).length, 0),
  totalPathAliases: Object.keys(PATH_ALIASES).length,
  modernizedComponents: ['ModernWeb8TabSystem', 'LocationConfigDemo', 'AGI Office Suite'],
  fixedErrors: 36, // 18 in LocationConfigDemo + 18 in ModernWeb8TabSystem
  version: '3.0.0',
  build: 'Ultra',
  lastUpdated: '2025-08-25'
}

export default {
  COMPONENT_REGISTRY,
  LIBRARY_REGISTRY,
  PATH_ALIASES,
  getComponentPath,
  getLibraryPath,
  getAllComponentPaths,
  getAllLibraryPaths,
  PROJECT_SUMMARY
}
