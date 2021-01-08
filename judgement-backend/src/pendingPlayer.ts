import WebSocket from 'ws';
import Logger from './logger';
import { MessageType, Message, CreateRoomMessage, JoinRoomMessage } from "./message";
import { Player } from './player';
import { RoomState } from './room';
import { RoomManager } from './roomManager';

export class PendingPlayer {
  public socket: WebSocket;
  private _joined: boolean = false;

  constructor(socket: WebSocket) {
    this.socket = socket;
    socket.on('message', (message) => {
      if(this._joined) {
        Logger.log('Ignoring message for pending player');
        return;
      }
      try {
        Logger.log('pendingPlayer::on message start');
        Logger.debug(message);
        let json = JSON.parse(message.toString());
        this.handleMessage(json);
        Logger.log('pendingPlayer::on message done')
      } catch (error) {
        Logger.log(`Failed to parse message from client ${message.toString()}. Exception: ${error}`);
      }
    });
  }

  public dispose() {
    Logger.log('Closing pendingPlayer websocket');
    this.socket.close();
  }

  private handleMessage(message: any) {
    if (message.action === MessageType.JoinRoom) {
      Logger.log('PendingPlayer::JoinRoom Message')
      this.handleJoinRoomMessage(message);
    }
    else if (message.action === MessageType.CreateRoom) {
      Logger.log('PendingPlayer::CreateRoom Message')
      this.handleCreateRoomMessage(message);
    }
    else {
      this.sendErrorMessage('PendingPlayer::UnknownMessage');
      Logger.log('PendingPlayer::UnknownMessage')
      Logger.debug(message);
    }
  }

  private handleJoinRoomMessage(message: JoinRoomMessage) {
    try {
      let room = RoomManager.getRoom(message.roomCode);
      if(room === undefined) {
        Logger.log(`Cannot find room. Room Code: ${message.roomCode}`);
        this.sendErrorMessage(`Cannot find room. RoomCode: ${message.roomCode}`);
      }
      else if(room.roomState === RoomState.Open) {
        Logger.log('PendingPlayer::Join Open Room');
        let player = new Player(this.socket, room);
        player.name = message.name;
        room.join(player);
        this._joined = true;
      }
      else if(room.roomState === RoomState.Locked) {
        Logger.log('PendingPlayer::Cannot join locked Room');
        this.sendErrorMessage('Failed to Join! Game already started');
      }
      else if(room.roomState === RoomState.TempOpen) {
        Logger.log('PendingPlayer::Joining Temp Open Room');
        room.rejoin(message.name, this.socket);
        this._joined = true;
      }
    } catch (error) {
      Logger.log('PendingPlayer::Error handleJoinRoomMessage');
      Logger.log(error);
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
      Logger.log(error);
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
      Logger.log(`Error: Player::sendMessage Can't send message because socket is not open.`);
    }
  }
}