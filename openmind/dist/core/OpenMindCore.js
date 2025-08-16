"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenMindCore = void 0;
const KnowledgeGraph_1 = require("./KnowledgeGraph");
const ReasoningEngine_1 = require("./ReasoningEngine");
const CollectiveIntelligence_1 = require("./CollectiveIntelligence");
class OpenMindCore {
    constructor() {
        this.knowledgeGraph = new KnowledgeGraph_1.KnowledgeGraph();
        this.reasoningEngine = new ReasoningEngine_1.ReasoningEngine(this.knowledgeGraph);
        this.collectiveIntelligence = new CollectiveIntelligence_1.CollectiveIntelligence();
    }
    start() {
        console.log('OpenMind Core is starting...');
        this.knowledgeGraph.load();
        setInterval(() => this.reasoningEngine.process(), 10000); // Process every 10 seconds
        console.log('OpenMind Core is running.');
    }
    handleConnection(socket) {
        this.collectiveIntelligence.addNode(socket);
        socket.on('query', (data) => {
            const result = this.reasoningEngine.query(data.query);
            socket.emit('response', { result });
        });
        socket.on('contribute', (data) => {
            this.knowledgeGraph.addNode(data.concept, data.data);
            this.collectiveIntelligence.broadcast('new_knowledge', { concept: data.concept });
        });
    }
}
exports.OpenMindCore = OpenMindCore;
