/*const express = require('express');
const http = require('http');
const app = express();

// Add these middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

let messageCount = 0;
const pendingDeliveries = [];

// Message Acceptance Endpoint
app.post('/send', (req, res) => {
  try {
    const { username, data, send_time} = req.body;

    if (!username || !data) {
      return res.status(400).json({ error: "username and data are required" });
    }

    const deliveryId = Date.now();

    pendingDeliveries.push({
      id: deliveryId,
      username,
      data,
      status: 'processing'
    });

    console.log(`📦 Received message from ${username}, message: ${data}, time: ${send_time}`);
    res.status(202).json({ deliveryId });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Status Processing Worker
function processDeliveries() {
  setInterval(() => {
    if (pendingDeliveries.length > 0) {
      const delivery = pendingDeliveries.shift();
      messageCount++;
      const isFailure = messageCount % 3 === 0; // Every 3rd fails

      // Select appropriate status code
      const statusCode = isFailure ?
        (messageCount % 5 === 0 ? 500 : 400) : // Vary failures
        200;
      
      const earthReq = http.request({
        hostname: '127.0.0.1',
        port: 8005,
        path: '/ReceiveResponse',
        method: 'POST'
      });
       

      // Write boolean status in body
      earthReq.write(JSON.stringify({
      status: !isFailure // true for success, false for failure
      }));

      earthReq.on('error', (err) => {
        console.error('❌ Delivery failed:', err.message);
      });
      earthReq.end();

      console.log(`Sent status: ${isFailure}`);
    }
  }, 1000);
}

processDeliveries();

app.listen(8002, () => console.log('🚀 Transport server running on port 8002'));*/
const express = require('express');
const http = require('http');

const app = express();

// Middleware for parsing JSON and URL-encoded bodies (only needed if you're accepting incoming POSTs)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let messageCount = 0;
const pendingDeliveries = [];

// Message Acceptance Endpoint (for external clients to send messages to this transport server)
app.post('/send', (req, res) => {
  try {
    const { username, data, send_time } = req.body;

    if (!username || !data) {
      return res.status(400).json({ error: "username and data are required" });
    }

    const deliveryId = Date.now();
    pendingDeliveries.push({
      id: deliveryId,
      username,
      data,
      status: 'processing'
    });

    console.log(`📦 Received message from ${username}, message: ${data}, time: ${send_time}`);
    res.status(202).json({ deliveryId });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Status Processing Worker
function processDeliveries() {
  setInterval(() => {
    if (pendingDeliveries.length > 0) {
      const delivery = pendingDeliveries.shift();
      messageCount++;
      const isFailure = messageCount % 3 === 0; // Every 3rd fails

      // Select appropriate status code
      const statusCode = isFailure ?
        (messageCount % 5 === 0 ? 500 : 400) : // Vary failures
        200;

      const postData = JSON.stringify({
        status: !isFailure // true for success, false for failure
      });

      const earthReq = http.request({
        hostname: 'localhost',
        port: 8005,
        path: '/ReceiveResponse',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      });

      earthReq.on('error', (err) => {
        console.error('❌ Delivery failed:', err.message);
      });

      earthReq.write(postData);
      earthReq.end();

      console.log(`Sent status: ${isFailure}`);
    }
  }, 1000);
}

processDeliveries();

app.listen(8002, () => {
  console.log('🚀 Transport server running on port 8002');
});