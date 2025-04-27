/*
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const EARTH_PORT = process.env.EARTH_PORT || 8005;
const TRANSPORT_LEVEL_HOST = process.env.TRANSPORT_HOST || '192.168.12.172';
const TRANSPORT_LEVEL_PORT = process.env.TRANSPORT_PORT || 8002;

const app = express();
app.use(cors({
  origin: '*', // Разрешаем доступ с любых доменов (для теста)
  methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store all Earth users and their messages
const earthUsers = new Map(); // { username: WebSocket[] }
const earthMessages = [];     // Global message history

// Метод для получения квитанций (receive_ack)
app.post('/receive_ack', (req, res) => {
  const { messageId, status, username } = req.body;
  
  if (earthUsers[username]) {
    earthUsers[username].forEach(ws => {
      ws.send(JSON.stringify({
        type: 'status',
        messageId,
        status,
        timestamp: new Date().toISOString()
      }));
    });
  }
  
  res.status(200).json({ success: true });
});

// Вебсокет соединения
wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.slice(1));
  const username = params.get('username');
  
  if (!username) {
    ws.close(4001, 'Username required');
    return;
  }

  if (!earthUsers[username]) {
    earthUsers[username] = [];
  }
  earthUsers[username].push(ws);
  console.log(`Earth: ${username} connected`);

  /*ws.on('message', async (message) => {
    try {
      const msg = JSON.parse(message);
      msg.username = username;
      msg.timestamp = new Date().toISOString();
      
      // Отправляем на транспортный уровень
      const response = await axios.post(
        `http://${TRANSPORT_LEVEL_HOST}:${TRANSPORT_LEVEL_PORT}/send_to_mars`,
        msg
      );
      
      // Уведомляем отправителя
      ws.send(JSON.stringify({
        type: 'status',
        messageId: msg.id || Date.now(),
        status: 'delivered',
        timestamp: msg.timestamp
      }));
    } catch (error) {
      console.error('Error sending to transport:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to send message'
      }));
    }
  });
   // Broadcast new messages to all Earth users
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      msg.sender = username;
      msg.timestamp = new Date().toISOString();
      msg.status = 'delivered';

      // Store message
      earthMessages.push(msg);

      // Broadcast to all Earth users
      earthUsers.forEach((sockets, user) => {
        sockets.forEach(socket => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msg));
          }
        });
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (earthUsers[username]) {
      earthUsers[username] = earthUsers[username].filter(socket => socket !== ws);
      if (earthUsers[username].length === 0) {
        delete earthUsers[username];
      }
    }
    console.log(`Earth: ${username} disconnected`);
  });
});

// Статика для фронтенда
app.use(express.static(path.join(__dirname, '../public')));

server.listen(EARTH_PORT, '0.0.0.0', () => {
  console.log(`Earth server running on:
  - HTTP: http://localhost:${EARTH_PORT}
  - WebSocket: ws://localhost:${EARTH_PORT}
  - Access from phone: http://<your-local-ip>:${EARTH_PORT}`);
});*/
/*
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const MARS_PORT = process.env.MARS_PORT || 8010;
const TRANSPORT_LEVEL_HOST = process.env.TRANSPORT_HOST || '192.168.12.172';
const TRANSPORT_LEVEL_PORT = process.env.TRANSPORT_PORT || 8002;

const app = express();
app.use(cors({
  origin: '*', // Разрешаем доступ с любых доменов (для теста)
  methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const marsUsers = {};

// Метод для получения сообщений (receive)
app.post('/receive', (req, res) => {
  const { username, text, timestamp, isError } = req.body;
  
  // Рассылаем всем клиентам Марса, кроме отправителя
  Object.keys(marsUsers).forEach(user => {
    if (user !== username) {
      marsUsers[user].forEach(ws => {
        ws.send(JSON.stringify({
          type: 'message',
          username,
          text: isError ? `Ошибка: ${text}` : text,
          timestamp,
          isError
        }));
      });
    }
  });
  
  // Отправляем квитанцию на транспортный уровень
  axios.post(`http://${TRANSPORT_LEVEL_HOST}:${TRANSPORT_LEVEL_PORT}/ack_to_earth`, {
    messageId: Date.now(),
    status: 'delivered',
    username,
    timestamp: new Date().toISOString()
  }).catch(console.error);
  
  res.status(200).json({ success: true });
});

// Вебсокет соединения
wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.slice(1));
  const username = params.get('username');
  
  if (!username) {
    ws.close(4001, 'Username required');
    return;
  }

  if (!marsUsers[username]) {
    marsUsers[username] = [];
  }
  marsUsers[username].push(ws);
  console.log(`Mars: ${username} connected`);

  ws.on('message', (message) => {
    // На Марсе нельзя отправлять сообщения
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Sending messages from Mars is not allowed'
    }));
  });

  ws.on('close', () => {
    if (marsUsers[username]) {
      marsUsers[username] = marsUsers[username].filter(socket => socket !== ws);
      if (marsUsers[username].length === 0) {
        delete marsUsers[username];
      }
    }
    console.log(`Mars: ${username} disconnected`);
  });
});

// Статика для фронтенда
app.use(express.static(path.join(__dirname, '../public')));

server.listen(MARS_PORT, '0.0.0.0', () => {
  console.log(`Mars server running on:
  - HTTP: http://localhost:${MARS_PORT}
  - WebSocket: ws://localhost:${MARS_PORT}
  - Access from phone: http://<your-local-ip>:${MARS_PORT}`);
});*/

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const EARTH_PORT = process.env.EARTH_PORT || 8005;
const TRANSPORT_LEVEL_HOST = process.env.TRANSPORT_HOST || '192.168.12.172';
const TRANSPORT_LEVEL_PORT = process.env.TRANSPORT_PORT || 8002;
const ENABLE_TRANSPORT = false
const app = express();
// Load Swagger spec
const swaggerDocument = YAML.load(path.join(__dirname, '../../public/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Improved data structures
const earthConnections = new Map(); // username => Set<WebSocket>
const messageHistory = [];          // Stores all messages

// Helper function to broadcast to Earth users
function broadcastToEarth(message) {
  earthConnections.forEach((sockets, username) => {
    sockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  });
}

// ACK endpoint (for future Mars transport)
app.post('/ReceiveResponse', (req, res) => {
  const { messageId, status, username } = req.body;
  
  const userSockets = earthConnections.get(username);
  if (userSockets) {
    userSockets.forEach(ws => {
      ws.send(JSON.stringify({
        type: 'status-update',
        messageId,
        status,
        timestamp: new Date().toISOString()
      }));
    });
  }
  
  res.status(200).json({ success: true });
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.split('?')[1]);
  const username = params.get('username');

  if (!username) {
    ws.close(4001, 'Username required');
    return;
  }

  // Add connection to map
  if (!earthConnections.has(username)) {
    earthConnections.set(username, new Set());
  }
  earthConnections.get(username).add(ws);
  console.log(`🌍 Earth user connected: ${username}`);
  console.log(
    '🌍 Active Earth Connections:',
    [...earthConnections.keys()].join(', ') || 'none'
  );
  // Output: "🌍 Earth users: Alice, Bob" or "🌍 Earth users: none"
  // Send message history
  ws.send(JSON.stringify({
    type: 'history',
    messages: messageHistory.slice(-100) // Last 100 messages
  }));

  // Message handler
  /*ws.on('message', async (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage);
      
      // Prepare message object
      const earthMessage = {
        ...message,
        sender: username,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        isEarth: true
      };

      // Store locally
      messageHistory.push(earthMessage);
      
      /*  FUTURE MARS TRANSPORT (UNCOMMENT WHEN READY)
      // Send to Mars transport layer
      try {
        await axios.post(
          `http://${TRANSPORT_LEVEL_HOST}:${TRANSPORT_LEVEL_PORT}/send_to_mars`,
          earthMessage
        );
      } catch (marsError) {
        console.error('Mars transport error:', marsError);
        earthMessage.status = 'earth-only';
      }
      

   
      broadcastToEarth(earthMessage);

    } catch (error) {
      console.error('Message processing error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });*/
  ws.on('message', async (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage);
      
      // Basic validation
      if (!message.text || typeof message.text !== 'string') {
        throw new Error('Invalid message format');
      }
  
      // Prepare the Earth message
      const earthMessage = {
        id: message.id || `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        text: message.text,
        sender: username,
        timestamp: new Date().toISOString(),
        status: 'sent', // Default status
        isEarth: true
      };
  
      // Store locally (no duplicate check needed)
      messageHistory.push(earthMessage);
  
      // Broadcast to other Earth users immediately
      broadcastToOthers(ws, earthMessage);
  
      // Only attempt transport if enabled
      if (ENABLE_TRANSPORT === 'true') {
        try {
          await axios.post(
            `http://${TRANSPORT_LEVEL_HOST}:${TRANSPORT_LEVEL_PORT}/send_to_mars`,
            earthMessage
          );
          // Status will update via /receive_ack later
        } catch (error) {
          updateMessageStatus(earthMessage.id, 'failed');
        }
      } else {
        // Local-only mode - confirm delivery immediately
        updateMessageStatus(earthMessage.id, 'sent');
      }
  
    } catch (error) {
      console.error('Message processing error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });
  
  // Helper functions
  function broadcastToOthers(senderWs, message) {
    earthConnections.forEach((sockets, user) => {
      sockets.forEach(ws => {
        if (ws !== senderWs && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
    });
  }
  
  function updateMessageStatus(messageId, status) {
    const message = messageHistory.find(m => m.id === messageId);
    if (message) {
      message.status = status;
      broadcastStatusUpdate(messageId, status);
    }
  }
  
  function broadcastStatusUpdate(messageId, status) {
    earthConnections.forEach(sockets => {
      sockets.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'status-update',
            messageId,
            status,
            timestamp: new Date().toISOString()
          }));
        }
      });
    });
  }
  // Cleanup on disconnect
  ws.on('close', () => {
    const userSockets = earthConnections.get(username);
    if (userSockets) {
      userSockets.delete(ws);
      if (userSockets.size === 0) {
        earthConnections.delete(username);
      }
    }
    console.log(`🌍 Earth user disconnected: ${username}`);
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(EARTH_PORT, '0.0.0.0', () => {
  console.log(`
  🌍 Earth Chat Server running
  Local: http://localhost:${EARTH_PORT}
  Network: http://${getLocalIpAddress()}:${EARTH_PORT}
  WebSocket: ws://${getLocalIpAddress()}:${EARTH_PORT}
  `);
});

// Helper to get local IP
function getLocalIpAddress() {
  return Object.values(require('os').networkInterfaces())
    .flat()
    .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';
}