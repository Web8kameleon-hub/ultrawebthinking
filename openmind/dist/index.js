"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const OpenMindCore_1 = require("./core/OpenMindCore");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const openMind = new OpenMindCore_1.OpenMindCore();
app.get('/', (req, res) => {
    res.send('<h1>OpenMind AGI Platform</h1><p>Status: Operational</p>');
});
io.on('connection', (socket) => {
    console.log('A new mind has connected.');
    openMind.handleConnection(socket);
    socket.on('disconnect', () => {
        console.log('A mind has disconnected.');
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`OpenMind server listening on port ${PORT}`);
    openMind.start();
});
