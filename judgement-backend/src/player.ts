import WebSocket from 'ws';
import { ICard } from './card';
import Room from './room';
import { Message, MessageType } from './message';

export interface IPlayer {
  socket: WebSocket;
  name: string;
  selectedCard: ICard | null;
}

class Player implements IPlayer {
  public socket: WebSocket;
  private _room: Room;
  public name: string;
  public hand: ICard[];
  public selectedCard: ICard | null;

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

    socket.on('close', () => {
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
    }
    if (message.action === 'PlayCard') {
      let playedCard = message.card;
      if (this.playedCardIsValid(playedCard)) {
        this.selectedCard = message.card;
        this._room.cardPlayed();
      }
    }
  }

  public sendMessage(message: Message) {
    this.socket.send(JSON.stringify(message));
  }
  
  private playedCardIsValid(playedCard: any): boolean {
    return true;
  }
}

export default Player;