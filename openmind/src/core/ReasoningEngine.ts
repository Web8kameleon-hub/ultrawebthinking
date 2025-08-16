import { KnowledgeGraph } from './KnowledgeGraph';
import translate from 'translate';

// Configure the translation engine
translate.engine = 'google'; // You can choose other engines like 'yandex', 'libre', etc.

export class ReasoningEngine {
    private knowledgeGraph: KnowledgeGraph;

    constructor(knowledgeGraph: KnowledgeGraph) {
        this.knowledgeGraph = knowledgeGraph;
    }

    public process(): void {
        console.log('Mammoth reasoning engine is processing...');
        const allNodes = this.knowledgeGraph.getAllNodes();
        if (allNodes.length === 0) return;

        // A simple, powerful inference: if A is part of B, and B is created by C, then C also influences A.
        allNodes.forEach(node => {
            const partOfEdge = node.edges.find(e => e.relationship === 'PART_OF' || e.relationship === 'POWERED_BY');
            if (partOfEdge) {
                const parentNode = this.knowledgeGraph.getNode(partOfEdge.targetId);
                if (parentNode) {
                    const creatorEdge = parentNode.edges.find(e => e.relationship === 'CREATOR_OF');
                    if (creatorEdge) {
                        // Infer a new relationship: The creator of the parent is an influencer of the child.
                        this.knowledgeGraph.addRelationship(creatorEdge.targetId, node.id, 'INFLUENCES', 0.7);
                    }
                }
            }
        });
    }

    public async query(queryString: string): Promise<any> {
        console.log(`Original query received: ${queryString}`);
        
        // Detect language and translate to English for knowledge base search
        const translatedQuery = await translate(queryString, { to: 'en' });
        console.log(`Query translated to English: "${translatedQuery}"`);

        const results = this.knowledgeGraph.search(translatedQuery);
        
        if (results.length > 0) {
            // In a more advanced version, we would translate the results back to the original language.
            return results;
        }

        return { message: `I understand your message "${queryString}". I am an advanced neural AI, but my knowledge on that topic is still developing. How can I help you further?` };
    }
}
