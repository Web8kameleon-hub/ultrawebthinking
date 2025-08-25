/**
 * AGI Context - Simple and Clean
 * Context i thjeshtë për AGI Core Integration
 * 
 * @author EuroWeb Platform
 * @version 8.0.0 Clean
 */

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AGICoreService } from '../agi/index';

// Simple AGI State
interface AGIContextState {
  isActive: boolean;
  isLearning: boolean;
  lastResponse?: string;
  currentQuery?: string;
  activeTasksCount: number;
}

// Simple AGI Actions
interface AGIContextActions {
  activateAGI: () => Promise<boolean>;
  deactivateAGI: () => Promise<boolean>;
  setCurrentQuery: (query: string) => void;
  setLastResponse: (response: string) => void;
  processQuery: (query: string) => Promise<string>;
}

// Complete Context Value
interface AGIContextValue {
  state: AGIContextState;
  actions: AGIContextActions;
}

// Create Context
const AGIContext = createContext<AGIContextValue | null>(null);

// Provider Props
interface AGIProviderProps {
  children: ReactNode;
}

// AGI Provider Component
export function AGIProvider({ children }: AGIProviderProps): React.JSX.Element {
  // Initialize AGI Core
  const [agiCore] = useState(() => new AGICoreService({
    modelVersion: '8.0.0-Clean',
    maxContextLength: 128000,
    temperature: 0.7,
    learningRate: 0.001,
    memoryCapacity: 1000000,
    processingNodes: 8
  }));

  // Simple State
  const [state, setState] = useState<AGIContextState>({
    isActive: false,
    isLearning: false,
    activeTasksCount: 0
  });

  // Simple Actions
  const actions: AGIContextActions = {
    activateAGI: async (): Promise<boolean> => {
      if (agiCore) {
        const result = await agiCore.activate();
        setState(prev => ({ ...prev, isActive: result }));
        return result;
      }
      return false;
    },

    deactivateAGI: async (): Promise<boolean> => {
      if (agiCore) {
        const result = await agiCore.deactivate();
        setState(prev => ({ ...prev, isActive: !result }));
        return result;
      }
      return false;
    },

    setCurrentQuery: (query: string): void => {
      setState(prev => ({ ...prev, currentQuery: query }));
    },

    setLastResponse: (response: string): void => {
      setState(prev => ({ ...prev, lastResponse: response }));
    },

    processQuery: async (query: string): Promise<string> => {
      setState(prev => ({ ...prev, currentQuery: query }));
      
      if (agiCore && state.isActive) {
        try {
          const taskId = await agiCore.processTask({
            type: 'generation',
            input: query
          });
          
          const response = `AGI Response: Processed "${query}" with ID ${taskId}`;
          setState(prev => ({ ...prev, lastResponse: response }));
          return response;
        } catch (error) {
          const errorResponse = `Error: ${(error as Error).message}`;
          setState(prev => ({ ...prev, lastResponse: errorResponse }));
          return errorResponse;
        }
      }
      
      const fallbackResponse = 'AGI not active';
      setState(prev => ({ ...prev, lastResponse: fallbackResponse }));
      return fallbackResponse;
    }
  };

  // Context Value
  const contextValue: AGIContextValue = {
    state,
    actions
  };

  return (
    <AGIContext.Provider value={contextValue}>
      {children}
    </AGIContext.Provider>
  );
}

// Custom Hook
export function useAGI(): AGIContextValue {
  const context = useContext(AGIContext);
  if (!context) {
    throw new Error('useAGI must be used within an AGIProvider');
  }
  return context;
}

// Simple State Hook
export function useAGIState(): AGIContextState {
  const { state } = useAGI();
  return state;
}

// Simple Actions Hook
export function useAGIActions(): AGIContextActions {
  const { actions } = useAGI();
  return actions;
}

// Named exports
export type {
    AGIContextActions, AGIContextState, AGIContextValue
};

