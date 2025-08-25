// Example Plugin
// Ky modul mund të importohet ose ekzekutohet nga jashtë trungut

export function examplePlugin() {
    console.log('Plugin i jashtëm u ekzekutua!');
    // Shto këtu logjikën tënde të zgjerimit
}

// Mund të importohet: import { examplePlugin } from './plugins/example-plugin';
