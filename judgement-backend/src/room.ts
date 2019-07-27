import Player from "./Player";
import StandardDeck from "./deck";
import { MessageType, PlayerInfo, PlayerInfoMessage, PlayerScoreMessage } from "./message";
import { ICard, Winner, Suit } from "./card";
import ScoreCard, { JudgementScore } from "./scorecard";

class Room {
  private _players: Player[];
  private _deck: StandardDeck;
  private _currentPlayerId: number;
  private _scoreCard: ScoreCard | null;
  public currentSuit: Suit | null;
  public trumpSuit: Suit | null;
  private _roundNumber: number;
  private _maxRounds: number;
  private _handsPlayedInCurrentRound: number;

  constructor() {
    this._players = [];
    this._deck = new StandardDeck();
    this._currentPlayerId = 0;
    this.currentSuit = null;
    this.trumpSuit = Suit.Spades;
    this._scoreCard = null;
    this._roundNumber = 0;
    this._maxRounds = 0;
    this._handsPlayedInCurrentRound = 0;
  }

  public isPlayerTurn(playerId: number) {
    if(this._currentPlayerId === 0) {
      this._currentPlayerId = playerId;
    }
    return playerId === this._currentPlayerId
  }

  private calcNextTurnPlayer(): number {
    const currPlayerIndex = this._players.findIndex(player => player.id === this._currentPlayerId);
    const nextPlayer = this._players[(currPlayerIndex + 1)%this._players.length];
    return nextPlayer.id;
  }

  private getCurrentPlayerName(): string {
    const currPlayerIndex = this._players.findIndex(p => p.id === this._currentPlayerId);
    if(currPlayerIndex === -1) return "";
    const currPlayer = this._players[currPlayerIndex];
    return currPlayer.name;
  }

  private sendScoresToAll(): void {
    let allPlayerScores: PlayerScoreMessage = {
      action: MessageType.AllScores,
      scores: this._scoreCard.getScores()
    }
    this._players.forEach(clientWs => {
      clientWs.sendMessage(allPlayerScores);
    });
  }

  public sendPlayerInfoToAll(): void {
    let playerInfoMessage: PlayerInfoMessage = {
      action: MessageType.AllPlayers,
      players: this.gatherAllPlayerInfo(),
      currentSuit: this.currentSuit,
      trumpSuit: this.trumpSuit,
      currentPlayerName: this.getCurrentPlayerName()
    }
    this._players.forEach(clientWs => {
      clientWs.sendMessage(playerInfoMessage)
    });
  }
  
  private gatherAllPlayerInfo(): PlayerInfo[] {
    let playerInfos = []
    this._players.forEach(player => {
      playerInfos.push({
        name: player.name,
        cardCount: player.hand.length,
        selectedCard: player.selectedCard
      });
    });
    return playerInfos;
  }

  private maxHandsInCurrentRound() {
    return this._maxRounds - this._roundNumber + 1;
  }

  public cardPlayed(player: Player): any {
    if(this.firstCard()) this.setCurrentSuit(player);
    this._currentPlayerId = this.calcNextTurnPlayer();
    this.sendPlayerInfoToAll();
    // if all players have played compute and declare winner
    if(this.allPlayersHavePlayedCard())
    {
      // Everyone has played.
      // 1. Compute winner
      let winner = this.calcWinner();
      // 2. Update next trick starter and suit
      this._currentPlayerId = this._players[winner].id;
      this.currentSuit = null;

      console.log(this._players[winner].name + ' is the winner');
      // 3. Clear out the selected card of all players
      setTimeout(() => {
        this._players.forEach(player => {
          player.selectedCard = null;
        });
        this.sendPlayerInfoToAll();
      }, 5000);
      // 4. Update winner
      this._scoreCard.scoreWinner(this._players[winner].name);
      this._handsPlayedInCurrentRound += 1;
      if(this._handsPlayedInCurrentRound == this.maxHandsInCurrentRound()) {
        this._scoreCard.endRound();
        if(this._roundNumber != this._maxRounds){ 
          setTimeout(() => this.startRound(), 5000);
        }
      }
      this.sendScoresToAll();
    }
  }

  private calcWinner(): number {
    let winner = 0;
    for (let i = 0; i < this._players.length; i++) {
      const player = this._players[i];
      if (Winner(this._players[winner].selectedCard, player.selectedCard, this.trumpSuit, this.currentSuit) === -1) {
        winner = i;
      }
    }
    return winner;
  }

  private setCurrentSuit(player: Player) {
    this.currentSuit = player.selectedCard.suit;
  }

  private firstCard() {
    return this.currentSuit === null;
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
    this._maxRounds = 4;
    //this._maxRounds = Math.floor(52 / this._players.length);
    this._scoreCard = new ScoreCard(this._players.map(p => p.name));
    this.startRound();
  }

  private startRound(): void {
    this._handsPlayedInCurrentRound = 0;
    this._roundNumber += 1;
    this.trumpSuit = this.updateTrumpSuit()
    this.dealInner(this.maxHandsInCurrentRound());
  }

  private updateTrumpSuit(): Suit {
    switch (this._roundNumber % 4) {
      case 0:
        return Suit.Spades;
      case 1:
        return Suit.Diamonds;
      case 2:
        return Suit.Hearts;
      case 3:
        return Suit.Clubs;
      default:
        return Suit.Spades;
    }
  }

  public dealInner(numberOfCards: number): void {
    this._scoreCard.startRound(numberOfCards);
    
    this._deck.resetDeck();

    this._players.forEach(player => {
      const hand = this._deck.drawRandom(numberOfCards);
      player.hand = hand;
      player.sendHand();
    });

    this.sendPlayerInfoToAll();
  }

  public setJudgement(playerName: string, prediction: number) {
    this._scoreCard.setJudgement(playerName, prediction);
    this.sendScoresToAll();
  }

  private printAllPlayers(): void {
    console.log("Current list of clients :");
    this._players.forEach(player => {
      console.log(player.name);
    });
  }
}

export default Room;