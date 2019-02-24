import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import Room from './room';
import Player from './Player';

const app = express();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let room = new Room();
wss.on('connection', function connection(ws) {
  console.log('A new connection!');
  let player = new Player(ws, room);
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function sendPlayerInfoToAll() {
  let playerInfos = [];
  clients.forEach(clientWs => {
    playerInfos.push({
      name: clientWs.name,
      cardCount: clientWs.hand.length
    });
  });
  clients.forEach(clientWs => {
    clientWs.socket.send(JSON.stringify({
      action: 'AllPlayers',
      players: playerInfos
    }));
  });
}

function printAllClients() {
  console.log("Current list of clients :");
  clients.forEach(clientWs => {
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
