// EuroWeb Web8 - Global Type Declarations
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

// React 19 types
declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react-dom' {
  export = ReactDOM;
  export as namespace ReactDOM;
}

// Missing module declarations
declare module 'hot-formula-parser' {
  export class Parser {
    parse(expression: string): { error: string | null; result: any };
    setFunction(name: string, fn: (...args: any[]) => any): void;
    setVariable(name: string, value: any): void;
    on(event: string, callback: (...args: any[]) => void): void;
    supported(thing: string): boolean;
  }
}

export {};
