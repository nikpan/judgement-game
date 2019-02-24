import Player from "./Player";
import StandardDeck from "./deck";
import { MessageType } from "./message";

class Room {
  _players: Player[];
  _deck: StandardDeck;

  constructor() {
    this._players = [];
    this._deck = new StandardDeck();
  }

  /**
   * sendPlayerInfoToAll
   */
  public sendPlayerInfoToAll(): void {
    let playerInfos = [];
    this._players.forEach(clientWs => {
      playerInfos.push({
        name: clientWs.name,
        cardCount: clientWs.hand.length
      });
    });
    this._players.forEach(clientWs => {
      clientWs.sendMessage({
        action: MessageType.AllPlayers,
        players: playerInfos
      })
    });
  }

  /**
   * removePlayer
   */
  public removePlayer(player: Player): void {
    var toRemove = this._players.findIndex(clientWs => clientWs.socket === socket);
    this._players.splice(toRemove, 1);
    this._room.sendPlayerInfoToAll();
  }

  /**
   * addPlayer
   */
  public addPlayer(player: Player): void {
    this._players.push(player);
  }

  public resetDeck(): void {

  }

  public deal(): void {
    this._deck.resetDeck();

    this._players.forEach(player => {
      const hand = this._deck.drawRandom(Math.floor(52 / this._players.length));
      player.sendMessage({
        action: MessageType.Hand,
        cards: hand
      });
    });
  }
}

export default Room;