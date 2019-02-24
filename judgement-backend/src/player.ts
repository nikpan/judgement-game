import WebSocket from 'ws';
import { Hand } from './card';
import Room from './room';
import { Message } from './message';

class Player {
  private socket: WebSocket;
  private _room: Room;
  public name: string;
  public hand: Hand[];

  constructor(socket: WebSocket, room: Room) {
    this.socket = socket;
    this._room = room;
    socket.on('message', (message) => {
      try {
        let json = JSON.parse(message.toString());
        this.handleMessage(json);
      } catch (error) {
        console.log(`Failed to parse message from client ${message.toString()}`);
      }
    });

    socket.on('close', (code, reason) => {
      var toRemove = this._players.findIndex(clientWs => clientWs.socket === socket);
      this._players.splice(toRemove, 1);
      this._room.sendPlayerInfoToAll();
    });
  }
  handleMessage(message: any) {
    if (message.action === 'Join') {
      let foo:Player = this;
      this._room.addPlayer(foo);
      this._players.push({ socket: socket, name: message.name, hand: [] });
      this._room.sendPlayerInfoToAll();
    }
    if (message.action === 'Deal') {
      deck.resetDeck();
      this._players.forEach(clientWs => {
        let hand = deck.drawRandom(Math.floor(52 / this._players.length));
        clientWs.hand = hand;
        var data = {
          action: 'Hand',
          cards: hand
        }
        clientWs.socket.send(JSON.stringify(data));
      });
      this._room.sendPlayerInfoToAll();
    }
  }

  /**
   * sendMessage
   */
  public socketsage(message: Message) {
    this._socket.send(JSON.stringify(message));
  }
}

export default Player;