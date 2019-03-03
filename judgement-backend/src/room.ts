import Player from "./Player";
import StandardDeck from "./deck";
import { MessageType } from "./message";
import { ICard, Winner, Suit } from "./card";

class Room {
  private _players: Player[];
  private _deck: StandardDeck;

  constructor() {
    this._players = [];
    this._deck = new StandardDeck();
  }

  public sendPlayerInfoToAll(): void {
    let playerInfos = [];
    this._players.forEach(player => {
      playerInfos.push({
        name: player.name,
        cardCount: player.hand.length,
        selectedCard: player.selectedCard
      });
    });
    this._players.forEach(clientWs => {
      clientWs.sendMessage({
        action: MessageType.AllPlayers,
        players: playerInfos
      })
    });
  }
  
  public cardPlayed(): any {
    this.sendPlayerInfoToAll();
    // if all players have played compute and declare winner
    if(this.allPlayersHavePlayedCard())
    {
      // Everyone has played. Compute winner
      let winner = 0;
      for (let i = 0; i < this._players.length; i++) {
        const player = this._players[i];
        if(Winner(this._players[winner].selectedCard, player.selectedCard, Suit.Spades) === -1){
          winner = i;
        }
      }
      console.log(this._players[winner].name + ' is the winner');
      setTimeout(() => {
        this._players.forEach(player => {
          player.selectedCard = null;
        });
        this.sendPlayerInfoToAll();
      }, 5000);
    }
  }

  private allPlayersHavePlayedCard(): boolean{
    let result = true;
    this._players.forEach(p => {
      result = result && p.selectedCard != null;
    });
    return result;
  }

  public removePlayer(player: Player): void {
    var toRemove = this._players.findIndex(p => p.socket === player.socket);
    this._players.splice(toRemove, 1);
    this.sendPlayerInfoToAll();
  }

  public addPlayer(player: Player): void {
    this._players.push(player);
    this.sendPlayerInfoToAll();
  }

  public deal(): void {
    this._deck.resetDeck();

    this._players.forEach(player => {
      const hand = this._deck.drawRandom(Math.floor(52 / this._players.length));
      player.hand = hand;
      player.sendHand();
    });

    this.sendPlayerInfoToAll();
  }

  private printAllPlayers(): void {
    console.log("Current list of clients :");
    this._players.forEach(player => {
      console.log(player.name);
    });
  }
}

export default Room;