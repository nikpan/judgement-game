import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import Room from './room';
import Player from './player';

const app = express();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server: http.Server = http.createServer(app);
const wss: WebSocket.Server = new WebSocket.Server({ server });

let room = new Room();
wss.on('connection', function connection(ws) {
  console.log('A new connection!');
  let player = new Player(ws, room);
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
  room = new Room();
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
