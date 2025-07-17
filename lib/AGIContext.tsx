// React Context for inter-component state management
import React, { createContext, useContext, ReactNode } from 'react';
import { agiCore, useAGIMemory, AGIMemoryStore } from './AGICore';
import { pandaTokens } from './PandaTokenController';

interface AGIContextValue {
  memory: AGIMemoryStore;
  actions: {
    setActiveTab: (tab: string) => void;
    setAGIStatus: (status: AGIMemoryStore['agi']['status']) => void;
    addAGIResponse: (query: string, response: string) => void;
    setNavigationState: (state: string) => void;
    setTheme: (theme: AGIMemoryStore['ui']['theme']) => void;
    updateScrollPosition: (position: number) => void;
    addToHistory: (item: string) => void;
    setUserPreference: (key: string, value: any) => void;
  };
  ui: {
    activateElement: (elementId: string) => void;
    pulseElement: (elementId: string) => void;
    setDynamicStyle: (key: string, value: string) => void;
  };
}

const AGIContext = createContext<AGIContextValue | null>(null);

interface AGIProviderProps {
  children: ReactNode;
}

export function AGIProvider({ children }: AGIProviderProps) {
  const memory = useAGIMemory(state => state);

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

    setNavigationState: (state: string) => {
      agiCore.setNavigationState(state);
    },

    setTheme: (theme: AGIMemoryStore['ui']['theme']) => {
      agiCore.setTheme(theme);
    },

    updateScrollPosition: (position: number) => {
      agiCore.updateMemory('ui.scrollPosition', position);
    },

    addToHistory: (item: string) => {
      const currentHistory = memory.user.history;
      const newHistory = [...currentHistory, item].slice(-50); // Keep last 50
      agiCore.updateMemory('user.history', newHistory);
    },

    setUserPreference: (key: string, value: any) => {
      const preferences = { ...memory.user.preferences, [key]: value };
      agiCore.updateMemory('user.preferences', preferences);
    }
  };

  const ui = {
    activateElement: (elementId: string) => {
      pandaTokens.activateElement(elementId);
    },

    pulseElement: (elementId: string) => {
      pandaTokens.pulseElement(elementId);
    },

    setDynamicStyle: (key: string, value: string) => {
      pandaTokens.setToken(key as any, value);
    }
  };

  const contextValue: AGIContextValue = {
    memory,
    actions,
    ui
  };

  return (
    <AGIContext.Provider value={contextValue}>
      {children}
    </AGIContext.Provider>
  );
}

// Custom hook to use AGI context
export function useAGI(): AGIContextValue {
  const context = useContext(AGIContext);
  if (!context) {
    throw new Error('useAGI must be used within an AGIProvider');
  }
  return context;
}

// Specialized hooks for specific use cases
export function useAGIState<T>(selector: (memory: AGIMemoryStore) => T): T {
  const { memory } = useAGI();
  return selector(memory);
}

export function useAGIActions() {
  const { actions } = useAGI();
  return actions;
}

export function useAGIUI() {
  const { ui } = useAGI();
  return ui;
}

// Higher-order component for automatic AGI integration
export function withAGI<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    activateOnMount?: boolean;
    elementId?: string;
  }
) {
  return function AGIWrappedComponent(props: P) {
    const { ui } = useAGI();

    React.useEffect(() => {
      if (options?.activateOnMount && options?.elementId) {
        ui.activateElement(options.elementId);
      }
    }, [ui]);

    return <Component {...props} />;
  };
}

export default AGIProvider;
