import WebSocket from 'ws';
import { Card } from './card';
import Room from './room';
import { Message } from './message';

class Player {
  public socket: WebSocket;
  private _room: Room;
  public name: string;
  public hand: Card[];

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
      this._room.removePlayer(this);
    });
  }
  handleMessage(message: any) {
    if (message.action === 'Join') {
      this.name = message.name;
      this.hand = [];
      this._room.addPlayer(this);
    }
    if (message.action === 'Deal') {
      this._room.deal();
      this.sendMessage({
        action: MessageType.Hand,
        cards: this.hand
      })
    }
  }

  /**
   * sendMessage
   */
  public sendMessage(message: Message) {
    this.socket.send(JSON.stringify(message));
  }
}

export default Player;