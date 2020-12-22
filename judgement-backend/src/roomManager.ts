import { Room } from "./room";

export class RoomManager {
  private static roomMap: Map<string, Room> = new Map<string, Room>();

  public static createRoom(): Room {
    const roomCode = RoomManager.getNewCode();
    const room = new Room(roomCode);
    this.roomMap.set(roomCode, room);
    return this.getRoom(roomCode);
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