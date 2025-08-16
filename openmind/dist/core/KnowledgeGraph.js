"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeGraph = void 0;
class KnowledgeGraph {
    constructor() {
        this.nodes = new Map();
    }
    load() {
        console.log('Loading knowledge graph...');
        // In a real application, this would load from a database
        this.addNode('Welcome', { message: 'Welcome to the OpenMind Knowledge Graph!' });
    }
    addNode(concept, data) {
        this.nodes.set(concept, Object.assign(Object.assign({}, data), { timestamp: Date.now() }));
        console.log(`Knowledge added for concept: ${concept}`);
    }
    getNode(concept) {
        return this.nodes.get(concept);
    }
    search(query) {
        const results = [];
        this.nodes.forEach((value, key) => {
            if (key.toLowerCase().includes(query.toLowerCase())) {
                results.push({ concept: key, data: value });
            }
        });
        return results;
    }
}
exports.KnowledgeGraph = KnowledgeGraph;
