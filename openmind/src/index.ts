/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export class OpenMindCore {
  private connections: Set<Socket> = new Set();

  handleConnection(socket: Socket) {
    this.connections.add(socket);
    socket.on('disconnect', () => {
      this.connections.delete(socket);
    });
  }

  start() {
    // Initialization logic for AGI core
    console.log('OpenMindCore is starting...');
  }
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const openMind = new OpenMindCore();

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
