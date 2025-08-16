import { Socket } from 'socket.io';

export class CollectiveIntelligence {
    private nodes: Set<Socket>;

    constructor() {
        this.nodes = new Set();
    }

    public addNode(socket: Socket): void {
        this.nodes.add(socket);
        console.log(`Node added to collective. Total nodes: ${this.nodes.size}`);
    }

    public removeNode(socket: Socket): void {
        this.nodes.delete(socket);
        console.log(`Node removed from collective. Total nodes: ${this.nodes.size}`);
    }

    public broadcast(event: string, data: any): void {
        this.nodes.forEach(socket => {
            socket.emit(event, data);
        });
    }
}
