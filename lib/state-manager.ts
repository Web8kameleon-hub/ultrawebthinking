/**
 * 🏛️ STATE MANAGER - ADVANCED APPLICATION STATE MANAGEMENT
 * Menaxhon state-in e aplikacionit me Redux-like pattern
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-STATE-MANAGER
 * @license MIT
 */

import { CacheController } from './cache-controller';

interface StateManagerConfig {
  enablePersistence: boolean;
  enableDevTools: boolean;
  enableMiddleware: boolean;
  cacheEnabled: boolean;
  maxHistorySize: number;
}

interface Action {
  type: string;
  payload?: any;
  meta?: {
    timestamp: number;
    id: string;
  };
}

interface StateSnapshot {
  state: any;
  timestamp: number;
  action: Action;
}

type Middleware = (store: StateManager) => (next: Dispatch) => (action: Action) => void;
type Dispatch = (action: Action) => void;
type Subscriber = (state: any, prevState: any) => void;
type Reducer<T> = (state: T, action: Action) => T;

/**
 * 🧠 STATE MANAGER CLASS
 */
export class StateManager<T = any> {
  private state: T;
  private reducer: Reducer<T>;
  private readonly subscribers: Set<Subscriber> = new Set();
  private history: StateSnapshot[] = [];
  private readonly config: StateManagerConfig;
  private readonly cache?: CacheController;
  private middlewares: Middleware[] = [];
  private isDispatching = false;

  constructor(
    initialState: T,
    reducer: Reducer<T>,
    config: Partial<StateManagerConfig> = {}
  ) {
    this.state = initialState;
    this.reducer = reducer;
    this.config = {
      enablePersistence: config.enablePersistence || false,
      enableDevTools: config.enableDevTools || false,
      enableMiddleware: config.enableMiddleware || true,
      cacheEnabled: config.cacheEnabled || true,
      maxHistorySize: config.maxHistorySize || 50
    };

    if (this.config.cacheEnabled) {
      this.cache = new CacheController({
        ttl: 300000, // 5 minutes
        maxSize: 10 * 1024 * 1024, // 10MB
        persistent: this.config.enablePersistence
      });
    }

    // Initialize from persistence if enabled
    if (this.config.enablePersistence) {
      this.loadFromPersistence();
    }

    // Setup dev tools if enabled
    if (this.config.enableDevTools && typeof window !== 'undefined') {
      this.setupDevTools();
    }
  }

  /**
   * 📦 GET CURRENT STATE
   */
  public getState(): T {
    return this.state;
  }

  /**
   * 🚀 DISPATCH ACTION
   */
  public dispatch(action: Action): void {
    if (this.isDispatching) {
      throw new Error('🚨 Cannot dispatch while dispatching');
    }

    if (!action.type) {
      throw new Error('🚨 Action must have a type');
    }

    // Add metadata
    const actionWithMeta: Action = {
      ...action,
      meta: {
        timestamp: Date.now(),
        id: this.generateActionId(),
        ...action.meta
      }
    };

    try {
      this.isDispatching = true;
      
      // Apply middleware
      let dispatch: Dispatch = (act: Action) => {
        const prevState = this.state;
        this.state = this.reducer(this.state, act);
        
        // Add to history
        this.addToHistory(prevState, act);
        
        // Notify subscribers
        this.notifySubscribers(prevState);
        
        // Cache if enabled
        if (this.cache) {
          this.cache.set('currentState', this.state);
        }
        
        // Persist if enabled
        if (this.config.enablePersistence) {
          this.saveToPersistence();
        }
      };

      // Apply middlewares in reverse order
      for (let i = this.middlewares.length - 1; i >= 0; i--) {
        dispatch = this.middlewares[i](this)(dispatch);
      }

      dispatch(actionWithMeta);
    } finally {
      this.isDispatching = false;
    }
  }

  /**
   * 👂 SUBSCRIBE TO STATE CHANGES
   */
  public subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber);
    
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  /**
   * 🔧 ADD MIDDLEWARE
   */
  public applyMiddleware(...middlewares: Middleware[]): void {
    if (this.isDispatching) {
      throw new Error('🚨 Cannot apply middleware while dispatching');
    }
    
    this.middlewares.push(...middlewares);
  }

  /**
   * 📖 GET HISTORY
   */
  public getHistory(): StateSnapshot[] {
    return [...this.history];
  }

  /**
   * ⏪ TIME TRAVEL - GO TO SPECIFIC POINT
   */
  public timeTravel(index: number): void {
    if (index < 0 || index >= this.history.length) {
      throw new Error('🚨 Invalid history index');
    }

    const snapshot = this.history[index];
    const prevState = this.state;
    
    this.state = snapshot.state;
    this.notifySubscribers(prevState);
    
    if (this.cache) {
      this.cache.set('currentState', this.state);
    }
  }

  /**
   * ⏮️ UNDO LAST ACTION
   */
  public undo(): void {
    if (this.history.length < 2) {
      console.warn('🚨 No actions to undo');
      return;
    }

    // Go to previous state
    this.timeTravel(this.history.length - 2);
  }

  /**
   * 🔄 REPLACE REDUCER
   */
  public replaceReducer(newReducer: Reducer<T>): void {
    this.reducer = newReducer;
    
    // Re-apply current state with new reducer
    const currentAction = this.history[this.history.length - 1]?.action || {
      type: '@@INIT',
      meta: { timestamp: Date.now(), id: this.generateActionId() }
    };
    
    this.dispatch({ ...currentAction, type: '@@REDUCER_REPLACED' });
  }

  /**
   * 📊 GET STATE ANALYTICS
   */
  public getAnalytics(): {
    totalActions: number;
    stateSize: number;
    memoryUsage: number;
    actionTypes: Record<string, number>;
    averageActionTime: number;
  } {
    const actionTypes: Record<string, number> = {};
    let totalTime = 0;

    this.history.forEach((snapshot, index) => {
      const type = snapshot.action.type;
      actionTypes[type] = (actionTypes[type] || 0) + 1;
      
      if (index > 0) {
        totalTime += snapshot.timestamp - this.history[index - 1].timestamp;
      }
    });

    const stateSize = new Blob([JSON.stringify(this.state)]).size;
    const memoryUsage = this.cache ? this.cache.getMetrics().memoryUsage : 0;
    const averageActionTime = this.history.length > 1 ? totalTime / (this.history.length - 1) : 0;

    return {
      totalActions: this.history.length,
      stateSize,
      memoryUsage,
      actionTypes,
      averageActionTime
    };
  }

  /**
   * 🎯 CREATE ACTION CREATOR
   */
  public createAction<P = any>(
    type: string
  ): (payload?: P) => Action {
    return (payload?: P) => ({
      type,
      payload
    });
  }

  /**
   * 🔧 CREATE ASYNC ACTION
   */
  public createAsyncAction<P = any, R = any>(
    type: string,
    asyncFn: (payload: P, dispatch: Dispatch, getState: () => T) => Promise<R>
  ): (payload: P) => Promise<R> {
    return async (payload: P) => {
      this.dispatch({ type: `${type}_PENDING`, payload });
      
      try {
        const result = await asyncFn(payload, this.dispatch.bind(this), this.getState.bind(this));
        this.dispatch({ type: `${type}_FULFILLED`, payload: result });
        return result;
      } catch (error) {
        this.dispatch({ type: `${type}_REJECTED`, payload: error });
        throw error;
      }
    };
  }

  /**
   * 🏪 SELECT STATE SLICE
   */
  public select<R>(selector: (state: T) => R): R {
    return selector(this.state);
  }

  /**
   * 👀 CREATE MEMOIZED SELECTOR
   */
  public createSelector<R>(
    selector: (state: T) => R,
    equalityFn?: (a: R, b: R) => boolean
  ): () => R {
    let lastResult: R;
    let lastState: T;
    
    return () => {
      if (lastState !== this.state) {
        const newResult = selector(this.state);
        
        if (equalityFn) {
          if (!equalityFn(lastResult, newResult)) {
            lastResult = newResult;
          }
        } else {
          lastResult = newResult;
        }
        
        lastState = this.state;
      }
      
      return lastResult;
    };
  }

  /**
   * 📜 ADD TO HISTORY
   */
  private addToHistory(prevState: T, action: Action): void {
    const snapshot: StateSnapshot = {
      state: { ...prevState } as T,
      timestamp: Date.now(),
      action
    };

    this.history.push(snapshot);

    // Limit history size
    if (this.history.length > this.config.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * 📢 NOTIFY SUBSCRIBERS
   */
  private notifySubscribers(prevState: T): void {
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(this.state, prevState);
      } catch (error) {
        console.error('🚨 Error in subscriber:', error);
      }
    });
  }

  /**
   * 💾 SAVE TO PERSISTENCE
   */
  private saveToPersistence(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const persistenceData = {
          state: this.state,
          timestamp: Date.now()
        };
        
        localStorage.setItem('stateManager', JSON.stringify(persistenceData));
      } catch (error) {
        console.warn('🚨 Failed to save to persistence:', error);
      }
    }
  }

  /**
   * 📥 LOAD FROM PERSISTENCE
   */
  private loadFromPersistence(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const persistedData = localStorage.getItem('stateManager');
        
        if (persistedData) {
          const { state } = JSON.parse(persistedData);
          this.state = state;
        }
      } catch (error) {
        console.warn('🚨 Failed to load from persistence:', error);
      }
    }
  }

  /**
   * 🛠️ SETUP DEV TOOLS
   */
  private setupDevTools(): void {
    if (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
        name: 'StateManager'
      });

      devTools.init(this.state);

      this.subscribe((state, prevState) => {
        const lastAction = this.history[this.history.length - 1]?.action;
        if (lastAction) {
          devTools.send(lastAction, state);
        }
      });
    }
  }

  /**
   * 🎲 GENERATE ACTION ID
   */
  private generateActionId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🧼 CLEAR HISTORY
   */
  public clearHistory(): void {
    this.history = [];
  }

  /**
   * 📊 EXPORT STATE
   */
  public exportState(): any {
    return {
      state: this.state,
      history: this.history,
      analytics: this.getAnalytics()
    };
  }

  /**
   * 📥 IMPORT STATE
   */
  public importState(exportedState: any): void {
    if (exportedState.state) {
      const prevState = this.state;
      this.state = exportedState.state;
      this.notifySubscribers(prevState);
    }

    if (exportedState.history) {
      this.history = exportedState.history;
    }
  }

  /**
   * 🔚 DESTROY STATE MANAGER
   */
  public destroy(): void {
    this.subscribers.clear();
    this.middlewares = [];
    this.history = [];
    
    if (this.cache) {
      this.cache.destroy();
    }
  }
}

/**
 * 🏭 BUILT-IN MIDDLEWARES
 */
export const middlewares = {
  /**
   * 📝 LOGGER MIDDLEWARE
   */
  logger: (): Middleware => (store) => (next) => (action) => {
    const prevState = store.getState();
    console.group(`🎬 Action: ${action.type}`);
    console.log('📦 Payload:', action.payload);
    console.log('⏱️ Timestamp:', new Date(action.meta?.timestamp || Date.now()));
    
    next(action);
    
    console.log('🔄 State changed:', prevState !== store.getState());
    console.groupEnd();
  },

  /**
   * ⏱️ PERFORMANCE MIDDLEWARE
   */
  performance: (): Middleware => (store) => (next) => (action) => {
    const startTime = performance.now();
    
    next(action);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 10) { // Log slow actions
      console.warn(`🐌 Slow action ${action.type}: ${duration.toFixed(2)}ms`);
    }
  },

  /**
   * 🛡️ ERROR HANDLER MIDDLEWARE
   */
  errorHandler: (): Middleware => (store) => (next) => (action) => {
    try {
      next(action);
    } catch (error) {
      console.error(`🚨 Error in action ${action.type}:`, error);
      
      // Dispatch error action
      store.dispatch({
        type: '@@ERROR',
        payload: {
          originalAction: action,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
};

/**
 * 🏭 REDUCER UTILITIES
 */
export const reducerUtils = {
  /**
   * 🔄 COMBINE REDUCERS
   */
  combineReducers<T extends Record<string, any>>(
    reducers: { [K in keyof T]: Reducer<T[K]> }
  ): Reducer<T> {
    return (state: T, action: Action) => {
      const newState = {} as T;
      let hasChanged = false;

      for (const key in reducers) {
        const previousStateForKey = state[key];
        const nextStateForKey = reducers[key](previousStateForKey, action);
        
        newState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }

      return hasChanged ? newState : state;
    };
  },

  /**
   * 🎯 CREATE REDUCER
   */
  createReducer<T>(
    initialState: T,
    handlers: Record<string, (state: T, action: Action) => T>
  ): Reducer<T> {
    return (state = initialState, action) => {
      const handler = handlers[action.type];
      return handler ? handler(state, action) : state;
    };
  }
};

export default StateManager;
