import { Room } from "./room";

export class RoomManager {
  private static roomMap: Map<string, Room> = new Map<string, Room>();
  private static roomInitTimeMap: Map<string, number> = new Map<string, number>();
  private static _cleanupTimer;

  public static createRoom(): Room {
    const roomCode = RoomManager.getNewCode();
    const room = new Room(roomCode);
    this.roomMap.set(roomCode, room);
    this.roomInitTimeMap.set(roomCode, Date.now());
    if(this._cleanupTimer === undefined) {
      RoomManager.initCleanupTimer();
    }
    return this.getRoom(roomCode);
  }

  private static initCleanupTimer() {
    this._cleanupTimer = setInterval(() => {
      this.roomMap.forEach((room, roomCode) => {
        if (this.roomInitTimeMap.has(roomCode)) {
          const currentTime = Date.now();
          const roomInitTime = this.roomInitTimeMap.get(roomCode);
          if (currentTime - roomInitTime > 3600000) {
            // 1 hour 
            room.dispose();
          }
        }
      });
    }, 3600000);
  }

  public static getRoom(roomCode: string): Room {
    return this.roomMap.get(roomCode);
  }

  public static getAllRoomInfo() {
    let result = '';
    this.roomMap.forEach( (room, roomCode) => {
      result += `Room Code: ${roomCode}. Players: ${room.getPlayerNameList().toString()} \n` ;
    });
    return result;
  }

  private static getNewCode(): string {
    const length = 5;
    var result = '';
    // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}