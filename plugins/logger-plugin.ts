// Logger Plugin
// Ky plugin stron si të logosh evente dhe të përdorësh konfigurim të jashtëm

export interface LoggerPluginOptions {
    prefix?: string;
}

export function loggerPlugin(message: string, options?: LoggerPluginOptions) {
    const prefix = options?.prefix ?? '[PLUGIN]';
    console.log(`${prefix} ${message}`);
}

// Shembull përdorimi:
// import { loggerPlugin } from './plugins/logger-plugin';
// loggerPlugin('Event i ri!', { prefix: '[MyApp]' });
