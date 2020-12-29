import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import { PendingPlayer } from './pendingPlayer';
import { RoomManager } from './roomManager';

const app = express();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server: http.Server = http.createServer(app);
const wss: WebSocket.Server = new WebSocket.Server({ server });

let pendingPlayerList = [];
wss.on('connection', function connection(ws) {
  console.log('A new connection!');
  let pendingPlayer = new PendingPlayer(ws);
  pendingPlayerList.push(pendingPlayer);
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.get('/', (_req, res) => {
  res.send('Hello World! Welcome to Judgement Game Backend!')
});

app.get('/pending-list', (_req, res) => {
  res.send(pendingPlayerList.toString());
});

app.get('/rooms', (_req, res) => {
  res.send(RoomManager.getAllRoomInfo());
});

app.get('/delete-rooms', (_req, res) => {
  RoomManager.deleteAllRooms();
  res.send('Rooms deleted');
});

function normalizePort(val: string) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error: Error): void {
  console.log('Error: ' + error);
}

function onListening(): void {
  console.log('Listening...');
}
