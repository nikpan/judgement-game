import WebSocket from 'ws';
import { MessageType, Message, CreateRoomMessage, JoinRoomMessage } from "./message";
import { Player } from './player';
import { RoomManager } from './roomManager';

export class PendingPlayer {
  public socket: WebSocket;
  private _joined: boolean = false;

  constructor(socket: WebSocket) {
    this.socket = socket;
    socket.on('message', (message) => {
      if(this._joined) {
        return;
      }
      try {
        console.log('pendingPlayer');
        console.debug(message);
        let json = JSON.parse(message.toString());
        this.handleMessage(json);
      } catch (error) {
        console.log(`Failed to parse message from client ${message.toString()}. Exception: ${error}`);
      }
    });
  }

  public dispose() {
    this.socket.close();
  }

  private handleMessage(message: any) {
    if (message.action === MessageType.JoinRoom) {
      this.handleJoinRoomMessage(message);
    }
    else if (message.action === MessageType.CreateRoom) {
      this.handleCreateRoomMessage(message);
    }
    else {
      this.sendErrorMessage('PendingPlayer::UnknownMessage');
      console.debug(message);
    }
  }

  private handleJoinRoomMessage(message: JoinRoomMessage) {
    try {
      let room = RoomManager.getRoom(message.roomCode);
      let player = new Player(this.socket, room);
      player.name = message.name;
      room.join(player);
      this._joined = true;
    } catch (error) {
      console.log(error);
      this.sendErrorMessage('Failed to Join Room');
    }
  }

  private handleCreateRoomMessage(message: CreateRoomMessage) {
    try {
      let room = RoomManager.createRoom();
      let player = new Player(this.socket, room);
      player.name = message.name;
      room.join(player);
      this._joined = true;
    } catch (error) {
      console.log(error);
      this.sendErrorMessage('Failed to Create Room');
    }
  }

  public sendErrorMessage(errorCode: string) {
    this.sendMessage({
      action: MessageType.Error,
      code: errorCode
    });
  }

  public sendMessage(message: Message) {
    if (this.socket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
    else {
      console.log(`Error: Player::sendMessage Can't send message because socket is not open.`);
    }
  }
}