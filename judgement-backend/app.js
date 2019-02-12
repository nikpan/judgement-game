const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const StandardDeck = require('./deck');

const app = express();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clientWebSockets = [];
let deck = new StandardDeck();

wss.on('connection', function connection(ws) {
  console.log('A new connection!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if(JSON.parse(message)) {
      message = JSON.parse(message);
      if(message.action === 'Join')
      {
        clientWebSockets.push({ socket: ws, name: message.name});
        console.log(message.name + " added");
        printAllClients();
      }
      if(message.action === 'Deal')
      {
        deck.resetDeck();
        clientWebSockets.forEach(clientWs => {
          var data = {
            action: 'Hand',
            cards: deck.drawRandom(52 / clientWebSockets.length )
          }
          clientWs.socket.send(JSON.stringify(data));
        });
      }
    }
  });

  ws.on('close', function outgoing(code, reason) {
    var toRemove = clientWebSockets.findIndex(clientWs => clientWs.socket === ws);
    console.log("Bye bye " + toRemove + clientWebSockets[toRemove].name);
    clientWebSockets.splice(toRemove, 1);
    printAllClients();
  });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function printAllClients() {
  console.log("Current list of clients :");
  clientWebSockets.forEach(clientWs => {
    console.log(clientWs.name);
  });
}

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  console.log('Error: ' + error);
}

function onListening() {
  console.log('Listening...')
}
