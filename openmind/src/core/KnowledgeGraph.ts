import * as fs from 'fs';
import * as path from 'path';

/**
 * @author Ledjan Ahmati
 * @version 8.2.0-WEB8-MAMMOTH
 * @contact dealsjona@gmail.com
 */

// ... (interfaces Node and Edge remain the same)
interface Node {
    id: string;
    label: string;
    data: any;
    edges: Edge[];
}

interface Edge {
    relationship: string;
    targetId: string;
    weight: number;
}

const KNOWLEDGE_BASE_PATH = path.join(__dirname, '../../knowledge_base.json');

/**
 * An "ultra-intelligent" knowledge core that uses a graph structure 
 * to store and reason about interconnected concepts. Now with persistence.
 */
export class KnowledgeGraph {
    private nodes: Map<string, Node>;

    constructor() {
        this.nodes = new Map();
        this.loadFromFile(); // Load from file first, then supplement with core knowledge.
    }

    /**
     * Loads the foundational knowledge into the graph.
     * This is called if no knowledge base file is found.
     */
    private initializeCoreKnowledge(): void {
        console.log('No existing knowledge base found. Initializing with core knowledge...');

        // Add core nodes
        this.addNode('ledjan_ahmati', 'Ledjan Ahmati', { role: 'Creator, Visionary, AGI Architect' });
        this.addNode('web8_ultrathinking', 'Web8 UltraThinking', { type: 'AGI Platform', status: 'Operational' });
        this.addNode('openmind_ai', 'OpenMind AI', { type: 'Conversational AI Interface', part_of: 'web8_ultrathinking' });
        this.addNode('knowledge_graph', 'Knowledge Graph', { description: 'The core reasoning and memory foundation of the AI.' });
        this.addNode('multilingual_support', 'Multilingual Support', { description: 'The ability to understand and process multiple human languages.' });

        // Add relationships to build the web of knowledge
        this.addRelationship('ledjan_ahmati', 'web8_ultrathinking', 'CREATOR_OF', 1.0);
        this.addRelationship('openmind_ai', 'web8_ultrathinking', 'POWERED_BY', 1.0);
        this.addRelationship('openmind_ai', 'knowledge_graph', 'USES', 1.0);
        this.addRelationship('openmind_ai', 'multilingual_support', 'HAS_FEATURE', 1.0);
        this.addRelationship('web8_ultrathinking', 'openmind_ai', 'HAS_COMPONENT', 0.9);

        console.log('Knowledge core initialized. AI is now ultra-intelligent.');
        this.saveToFile(); // Save the initial graph
    }

    /**
     * Adds a new concept (node) to the knowledge graph.
     * @param id A unique identifier for the node.
     * @param label A human-readable name.
     * @param data An object containing the node's properties.
     */
    public addNode(id: string, label: string, data: any): void {
        if (this.nodes.has(id)) {
            const node = this.nodes.get(id)!;
            node.data = { ...node.data, ...data };
        } else {
            const newNode: Node = { id, label, data, edges: [] };
            this.nodes.set(id, newNode);
        }
    }

    /**
     * Creates a directed, weighted relationship between two nodes.
     * @param sourceId The ID of the starting node.
     * @param targetId The ID of the ending node.
     * @param relationship A description of the relationship.
     * @param weight The strength of the connection.
     */
    public addRelationship(sourceId: string, targetId: string, relationship: string, weight: number): void {
        const sourceNode = this.nodes.get(sourceId);
        const targetNode = this.nodes.get(targetId);

        if (!sourceNode || !targetNode) {
            return;
        }

        // Avoid duplicate relationships
        if (!sourceNode.edges.some(e => e.targetId === targetId && e.relationship === relationship)) {
            const newEdge: Edge = { relationship, targetId, weight };
            sourceNode.edges.push(newEdge);
        }
    }

    public getNode(id: string): Node | undefined {
        return this.nodes.get(id);
    }
    
    public getAllNodes(): Node[] {
        return Array.from(this.nodes.values());
    }

    /**
     * Performs an intelligent search. It finds nodes matching the query 
     * and also includes directly related nodes to provide rich context.
     * @param query The search string.
     * @returns An array of rich result objects.
     */
    public search(query: string): any[] {
        const lowerCaseQuery = query.toLowerCase();
        const directResults: Node[] = [];
        const finalResults: any[] = [];

        this.nodes.forEach(node => {
            if (node.label.toLowerCase().includes(lowerCaseQuery) || node.id.toLowerCase().includes(lowerCaseQuery)) {
                directResults.push(node);
            }
        });

        directResults.forEach(node => {
            const related_info = node.edges.map(edge => {
                const targetNode = this.nodes.get(edge.targetId);
                return {
                    relationship: edge.relationship,
                    target: targetNode ? targetNode.label : 'Unknown',
                    details: targetNode ? targetNode.data : {}
                };
            });

            finalResults.push({
                concept: node.label,
                data: node.data,
                related_info
            });
        });

        return finalResults;
    }

    /**
     * Saves the current state of the knowledge graph to a JSON file.
     */
    public saveToFile(): void {
        try {
            const data = JSON.stringify(Array.from(this.nodes.entries()), null, 2);
            fs.writeFileSync(KNOWLEDGE_BASE_PATH, data, 'utf-8');
            console.log(`Knowledge graph saved to ${KNOWLEDGE_BASE_PATH}`);
        } catch (error) {
            console.error('Error saving knowledge graph:', error);
        }
    }

    /**
     * Loads the knowledge graph from a JSON file.
     */
    public loadFromFile(): void {
        try {
            if (fs.existsSync(KNOWLEDGE_BASE_PATH)) {
                const data = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf-8');
                const parsedData = JSON.parse(data);
                this.nodes = new Map(parsedData);
                console.log(`Knowledge graph loaded from ${KNOWLEDGE_BASE_PATH}`);
            } else {
                this.initializeCoreKnowledge();
            }
        } catch (error) {
            console.error('Error loading knowledge graph:', error);
            this.initializeCoreKnowledge();
        }
    }
}
