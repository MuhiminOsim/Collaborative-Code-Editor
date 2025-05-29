const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');

// Keep a global reference of the window object
let mainWindow;

// Server setup
const expressApp = express();
expressApp.use(cors());

// Serve static files
expressApp.use(express.static(__dirname));
expressApp.use(express.static(path.join(__dirname, 'node_modules')));

// Serve host interface
expressApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve client interface
expressApp.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

const server = http.createServer(expressApp);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected clients and their code
const connectedClients = new Map();
let sharedCode = '// Start coding here...';

// Get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  connectedClients.set(socket.id, true);
  
  // Broadcast updated stats
  io.emit('stats', {
    connectedUsers: connectedClients.size,
    activeSessions: 1
  });
  
  socket.emit('initial-code', sharedCode);
  
  socket.on('code-change', (newCode) => {
    sharedCode = newCode;
    socket.broadcast.emit('code-update', newCode);
  });

  socket.on('cursor-position', (data) => {
    socket.broadcast.emit('cursor-update', {
      userId: socket.id,
      position: data
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
    
    // Broadcast updated stats
    io.emit('stats', {
      connectedUsers: connectedClients.size,
      activeSessions: 1
    });
  });
});

// Start server
const startServer = async (initialPort) => {
  let currentPort = initialPort;
  const maxAttempts = 10;
  const localIP = getLocalIP();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        server.listen(currentPort, '0.0.0.0', () => {
          console.log(`Server running on:`);
          console.log(`- Local: http://localhost:${currentPort}`);
          console.log(`- Network: http://${localIP}:${currentPort}`);
          resolve();
        }).on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            currentPort++;
            reject(new Error('Port in use'));
          } else {
            reject(err);
          }
        });
      });
      return currentPort; // Successfully started server
    } catch (err) {
      if (attempt === maxAttempts - 1) {
        throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
      }
      console.log(`Port ${currentPort - 1} in use, trying ${currentPort}...`);
    }
  }
};

// Create the browser window
async function createWindow() {
  try {
    const port = await startServer(3001);
    
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Load the host interface
    mainWindow.loadURL(`http://localhost:${port}`);

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    app.quit();
  }
}

app.on('ready', () => {
  createWindow().catch((error) => {
    console.error('Failed to create window:', error);
    app.quit();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
}); 