const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected clients and their code
const connectedClients = new Map();
let sharedCode = '// Start coding here...';  // Initialize with default value

// Get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  connectedClients.set(socket.id, true);
  console.log('Total connected clients:', connectedClients.size);
  
  // Send current code state to newly connected client
  console.log('Sending current code to new client:', sharedCode);
  socket.emit('initial-code', sharedCode);
  
  // Handle code updates
  socket.on('code-change', (newCode) => {
    console.log('Received code change from client:', socket.id);
    console.log('New code:', newCode);
    sharedCode = newCode;  // Update the shared code
    
    // Broadcast to all clients except sender
    socket.broadcast.emit('code-update', newCode);
    console.log('Broadcasted code update to other clients');
  });

  // Handle cursor position updates
  socket.on('cursor-position', (data) => {
    console.log('Cursor update from client:', socket.id, data);
    socket.broadcast.emit('cursor-update', {
      userId: socket.id,
      position: data
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
    console.log('Total connected clients:', connectedClients.size);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server running on: http://${localIP}:${PORT}`);
}); 