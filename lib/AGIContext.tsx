// React Context for inter-component state management
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { agiCore, AGIMemoryStore } from './AGICore';

interface AGIContextValue {
  memory: AGIMemoryStore;
  actions: {
    [x: string]: any;
    setActiveTab: (tab: string) => void;
    setAGIStatus: (status: AGIMemoryStore['agi']['status']) => void;
    addAGIResponse: (query: string, response: string) => void;
    setBreadcrumbs: (breadcrumbs: Array<{ label: string; path: string }>) => void;
    recordLoadTime: (component: string, time: number) => void;
    processQuery: (query: string) => Promise<string>;
    reset: () => void;
  };
}

const AGIContext = createContext<AGIContextValue | null>(null);

interface AGIProviderProps {
  children: ReactNode;
}

export function AGIProvider({ children }: AGIProviderProps) {
  const [memory, setMemory] = useState<AGIMemoryStore>(agiCore.getMemory());

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = (agiCore as any).subscribe?.((newMemory: AGIMemoryStore) => {
        setMemory(newMemory);
      });
    } catch (error) {
      console.warn('AGI subscribe not available:', error);
    }
    return () => {
      try {
        unsubscribe?.();
      } catch (error) {
        console.warn('AGI unsubscribe error:', error);
      }
    };
  }, []);

  const actions = {
    setActiveTab: (tab: string) => {
      agiCore.setActiveTab(tab);
    },

    setAGIStatus: (status: AGIMemoryStore['agi']['status']) => {
      agiCore.setAGIStatus(status);
    },

    addAGIResponse: (query: string, response: string) => {
      agiCore.addAGIResponse(query, response);
    },

    setBreadcrumbs: (breadcrumbs: Array<{ label: string; path: string }>) => {
      try {
        (agiCore as any).setBreadcrumbs?.(breadcrumbs);
      } catch (error) {
        console.warn('setBreadcrumbs not available:', error);
      }
    },

    recordLoadTime: (component: string, time: number) => {
      try {
        (agiCore as any).recordLoadTime?.(component, time);
      } catch (error) {
        console.warn('recordLoadTime not available:', error);
      }
    },

    processQuery: (query: string) => {
      try {
        return (agiCore as any).processQuery?.(query) || Promise.resolve('AGI not available');
      } catch (error) {
        console.warn('processQuery not available:', error);
        return Promise.resolve('Error processing query');
      }
    },

    reset: () => {
      try {
        (agiCore as any).reset?.();
      } catch (error) {
        console.warn('reset not available:', error);
      }
    }
  };

  const contextValue: AGIContextValue = {
    memory,
    actions
  };

  return (
    <AGIContext.Provider value={contextValue}>
      {children}
    </AGIContext.Provider>
  );
}

export function useAGI(): AGIContextValue {
  const context = useContext(AGIContext);
  if (!context) {
    throw new Error('useAGI must be used within an AGIProvider');
  }
  return context;
}

export default AGIContext;
