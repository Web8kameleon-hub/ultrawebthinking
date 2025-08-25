import { Socket } from 'socket.io';
import { KnowledgeGraph } from './KnowledgeGraph';
// Update the import path if the file is named ReasoningEngine.tsx or located elsewhere
import { ReasoningEngine } from './ReasoningEngine';
// Removed: import { CollectiveIntelligence } from './CollectiveIntelligence';

/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

export class OpenMindCore {
    private knowledgeGraph: KnowledgeGraph;
    private reasoningEngine: ReasoningEngine;
    private collectiveIntelligence: CollectiveIntelligence;

    constructor() {
        this.knowledgeGraph = new KnowledgeGraph();
        this.reasoningEngine = new ReasoningEngine(this.knowledgeGraph);
        this.collectiveIntelligence = new CollectiveIntelligence();
    }

    public start(): void {
        console.log('OpenMind Core is starting...');
        this.knowledgeGraph.load();
        setInterval(() => this.reasoningEngine.process(), 10000); // Process every 10 seconds
        console.log('OpenMind Core is running.');
    }

    public handleConnection(socket: Socket): void {
        this.collectiveIntelligence.addNode(socket);

        socket.on('query', async (data) => {
            const result = await this.reasoningEngine.query(data.query);
            socket.emit('response', { result });
        });

        socket.on('contribute', (data) => {
            this.knowledgeGraph.addNode(data.concept, data.data, data.meta ?? {});
            this.collectiveIntelligence.broadcast('new_knowledge', { concept: data.concept });
        });
    }
}

export class CollectiveIntelligence {
    private nodes: any[] = [];

    public addNode(node: any): void {
        this.nodes.push(node);
    }

    public broadcast(event: string, data: any): void {
        this.nodes.forEach((node: any) => {
            if (typeof node.emit === 'function') {
                node.emit(event, data);
            }
        });
    }
}

/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

// Remove local KnowledgeGraph class definition; use imported version instead.
