"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const express_1 = __importDefault(require("express"));
const deck_1 = __importDefault(require("./deck"));
const Player_1 = __importDefault(require("./Player"));
const room_1 = __importDefault(require("./room"));
const app = express_1.default();
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
let clients = [];
let deck = new deck_1.default();
let room = new room_1.default();
wss.on('connection', function connection(ws) {
    console.log('A new connection!');
    let player = new Player_1.default(ws, room);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        if (JSON.parse(message)) {
            message = JSON.parse(message);
            if (message.action === 'Join') {
                clients.push({ socket: ws, name: message.name, hand: [] });
                sendPlayerInfoToAll();
            }
            if (message.action === 'Deal') {
                deck.resetDeck();
                clients.forEach(clientWs => {
                    let hand = deck.drawRandom(Math.floor(52 / clients.length));
                    clientWs.hand = hand;
                    var data = {
                        action: 'Hand',
                        cards: hand
                    };
                    clientWs.socket.send(JSON.stringify(data));
                });
                sendPlayerInfoToAll();
            }
        }
    });
    ws.on('close', function outgoing(code, reason) {
        var toRemove = clients.findIndex(clientWs => clientWs.socket === ws);
        clients.splice(toRemove, 1);
        sendPlayerInfoToAll();
    });
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
    console.log('Listening...');
}
//# sourceMappingURL=app.js.map