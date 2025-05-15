const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const EARTH_PORT = 8005;
const TRANSPORT_LEVEL_HOST = 'localhost';
const TRANSPORT_LEVEL_PORT = 8002;
//const TRANSPORT_LEVEL_HOST = '192.168.80.254';
//const TRANSPORT_LEVEL_PORT = 8080;
const ENABLE_TRANSPORT = true;

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
const YAML = require('yamljs');
const swaggerDocument = YAML.load('../../public/swagger.yaml');

// Add this after your other middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Track connections and messages
const activeConnections = new Map(); // username → Set<WebSocket>
const messageHistory = [];
const pendingMessages = [];

// Helper functions
function broadcastToOthers(senderWs, message) {
  activeConnections.forEach((sockets, username) => {
    sockets.forEach(ws => {
      if (ws !== senderWs && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  });
}

function broadcastStatusUpdate(message, status) {
  const statusUpdate = {
    type: 'status-update',
    id: message.id, // Include ID for client-side matching
    text: message.text,
    sender: message.sender,
    timestamp: message.timestamp,
    status: status,
    updateTime: new Date().toISOString()
  };
  
  activeConnections.forEach(sockets => {
    sockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log("message_id: ", message.id)
        ws.send(JSON.stringify(statusUpdate));
      }
    });
  });

  const msgIndex = pendingMessages.findIndex(m => m.id === message.id);
  if (msgIndex >= 0) {
    pendingMessages.splice(msgIndex, 1);
  }
}

app.post('/ReceiveResponse', (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { status} = JSON.parse(body);
      const delivery_status = status ? 'delivered' : 'error';
      
      console.log(`\n=== Delivery Status ===`);
      console.log(`Processing as: ${delivery_status}`);
      
      if (pendingMessages.length > 0) {
        const message = pendingMessages.shift();
        message.status = status;
        broadcastStatusUpdate(message, delivery_status);
        console.log(`Updated message status`);
      }
       // 4. Return proper response (matches Swagger)
       res.status(200).json({ message: 'Квитанция получена' });
    } catch (e) {
      //console.error('Error processing status:', e);
      console.error('Error processing status:', e);
      res.status(400).json({ error: 'Invalid request format' });
    }
    
    //res.end();
  });
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.split('?')[1]);
  const username = params.get('username');

  if (!username) {
    ws.close(4001, 'Username required');
    return;
  }

  // Maintain active connections
  if (!activeConnections.has(username)) {
    activeConnections.set(username, new Set());
  }
  activeConnections.get(username).add(ws);

  const connectedUsernames = Array.from(activeConnections.keys());
  console.log(`🌍 User connected: ${username} (${activeConnections.get(username).size} connections)`);
  console.log(`📊 Total users: ${connectedUsernames.length} | Online: [${connectedUsernames.join(', ')}]`);
  // Send message history
  ws.send(JSON.stringify({
    type: 'history',
    messages: messageHistory.slice(-100)
  }));

  // Message handler
  ws.on('message', async (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage);
      if (!message.text) return;

      const earthMessage = {
        id: message.id ,
        text: message.text,
        sender: username,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      // Store and broadcast
      pendingMessages.push(earthMessage);
      messageHistory.push(earthMessage);
      broadcastToOthers(ws, earthMessage);

      if (ENABLE_TRANSPORT) {
        try {
          await axios.post(
            `http://${TRANSPORT_LEVEL_HOST}:${TRANSPORT_LEVEL_PORT}/send`,
            {
              username: username,
              text: message.text,
              send_time: earthMessage.timestamp
            }
          );
        } catch (error) {
          const msgIndex = pendingMessages.findIndex(m => m.id === earthMessage.id);
          if (msgIndex >= 0) {
            pendingMessages[msgIndex].status = 'error';
            broadcastStatusUpdate(pendingMessages[msgIndex], 'error');
            pendingMessages.splice(msgIndex, 1);
          }
        }
      }
    } catch (error) {
      console.error('Message error:', error);
    }
  });

  // Cleanup on close
  ws.on('close', () => {
    const userConnections = activeConnections.get(username);
    if (userConnections) {
      userConnections.delete(ws);
      console.log(`🌍 User disconnected: ${username} (${userConnections.size} remaining)`);

      // Remove user entry if no connections remain
      if (userConnections.size === 0) {
        activeConnections.delete(username);
      }

      const connectedUsernames = Array.from(activeConnections.keys());
      console.log(`📊 Total users: ${connectedUsernames.length} | Online: [${connectedUsernames.join(', ')}]`);
    }
  });
});


app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/*function getLocalIpAddress() {
  return Object.values(require('os').networkInterfaces())
    .flat()
    .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';
}*/

server.listen(EARTH_PORT, '0.0.0.0', () => {
  console.log(`
  🌍 Earth Chat Server running
  Local: http://localhost:${EARTH_PORT}
  Network: http://ip_address:${EARTH_PORT}
  WebSocket: ws://ip_address:${EARTH_PORT}
  `);
});