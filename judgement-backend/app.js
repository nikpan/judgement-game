const http = require('http');
const WebSocket = require('ws');
const express = require('express');

/**
 * Get port from environment and store in Express.
 */
const app = express();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * initialize the WebSocket server instance
 */

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A new connection!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  })

  ws.send('hola from websocket server!');
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.log('Error: ' + error);
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log('Listening...')
}
