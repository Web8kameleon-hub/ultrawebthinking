declare module 'hot-formula-parser' {
  export class Parser {
    parse(expression: string): { error: string | null; result: any };
    setFunction(name: string, fn: (...args: any[]) => any): void;
    setVariable(name: string, value: any): void;
    on(event: string, callback: (...args: any[]) => void): void;
    supported(thing: string): boolean;
  }
}
