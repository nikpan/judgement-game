import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import { RoomV2 } from './roomV2';
import { PlayerV2 } from './playerV2';

const app = express();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server: http.Server = http.createServer(app);
const wss: WebSocket.Server = new WebSocket.Server({ server });

// let room = new Room();
let room = new RoomV2();
wss.on('connection', function connection(ws) {
  console.log('A new connection!');
  // let player = new Player(ws, room);
  let player = new PlayerV2(ws, room);
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.get('/', (_req, res) => {
  res.send('Hello World! Welcome to Judgement Game Backend!')
});

app.get('/status', (_req, res) => {
  res.send(room.scoreCard);
});

app.get('/reset-room', (_req, res) => {
  room = new RoomV2();
  res.send('Room reset done!');
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
