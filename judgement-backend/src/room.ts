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
    this._players.forEach(player => {
      playerInfos.push({
        name: player.name,
        cardCount: player.hand.length
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
    var toRemove = this._players.findIndex(p => p.socket === player.socket);
    this._players.splice(toRemove, 1);
    this.sendPlayerInfoToAll();
  }

  /**
   * addPlayer
   */
  public addPlayer(player: Player): void {
    this._players.push(player);
    this.sendPlayerInfoToAll();
  }

  public resetDeck(): void {

  }

  public deal(): void {
    this._deck.resetDeck();

    this._players.forEach(player => {
      const hand = this._deck.drawRandom(Math.floor(52 / this._players.length));
      player.hand = hand;
    });

    this.sendPlayerInfoToAll();
  }
}

export default Room;