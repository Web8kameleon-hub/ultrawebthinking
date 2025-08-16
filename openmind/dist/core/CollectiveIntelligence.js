"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectiveIntelligence = void 0;
class CollectiveIntelligence {
    constructor() {
        this.nodes = new Set();
    }
    addNode(socket) {
        this.nodes.add(socket);
        console.log(`Node added to collective. Total nodes: ${this.nodes.size}`);
    }
    removeNode(socket) {
        this.nodes.delete(socket);
        console.log(`Node removed from collective. Total nodes: ${this.nodes.size}`);
    }
    broadcast(event, data) {
        this.nodes.forEach(socket => {
            socket.emit(event, data);
        });
    }
}
exports.CollectiveIntelligence = CollectiveIntelligence;
