import WebSocket from 'ws';
import { ICard } from './card';
import Room from './room';
import { Message, MessageType } from './message';
import { getId } from './util';

export interface IPlayer {
  id: number;
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
  public id: number;

  constructor(socket: WebSocket, room: Room) {
    this.socket = socket;
    this._room = room;
    this.id = getId();
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
      console.log(`${this.name} has left`);
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
      // Check if card suit is valid
      if(!this.validCard(playedCard)) {
        this.sendErrorMessage('InvalidCard');
        return; 
      }
      // Check if card is present in hand
      let toRemove = this.hand.findIndex(card => card.suit === playedCard.suit && card.rank === playedCard.rank);
      if(toRemove === -1) {
        this.sendErrorMessage('CardNotInHand');
        return;
      }
      if(!this._room.isPlayerTurn(this.id)) {
        this.sendErrorMessage('NotYourTurn');
        return;
      }
      this.selectedCard = message.card;
      this.hand.splice(toRemove, 1);
      this._room.cardPlayed(this);
      this.sendHand();
    }
  }
  
  private validCard(playedCard: ICard): boolean {
    console.log(playedCard.suit);
    console.log(this._room.currentSuit);
    if(this._room.currentSuit === null) return true;
    if(playedCard.suit === this._room.currentSuit) return true;
    if(this.hand.some(card => card.suit === this._room.currentSuit)) return false;
    return true;
  }

  public sendHand() {
    this.sendMessage({
      action: MessageType.Hand,
      cards: this.hand
    });
  }

  public sendErrorMessage(errorCode: string){
    this.sendMessage({
      action: MessageType.Error,
      code: errorCode
    })
  }

  public sendMessage(message: Message) {
    if (this.socket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
    else{
      console.log(`Error: Player::sendMessage Can't send message because socket is not open. Player:${this.name}`);
    }
  }
}

export default Player;