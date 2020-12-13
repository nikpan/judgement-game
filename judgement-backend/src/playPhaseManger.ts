import { ICard, Suit } from "./card";
import { IPlayer } from "./player";
import { HandManager } from "./handManager";
import { ScoreCardV2 } from "./scorecardV2";
import { GameStateV2 } from "./roomV2";

/**
 * PlayPhaseManager - Ensures one round of playing phase is played correctly 
 * 1. Start round with player next to dealer going first
 * 2. Play one hand in turn order
 * 3. After hand is played calculate winner
 * 4. Repeat from step 2 with winner going first until no cards left 
 * 
 * Interface
 * -> PlayCard
 * 
 * <- Update scores (score part)
 */
export class PlayPhaseManager {

  private _players: IPlayer[];
  private _handManager: HandManager;
  private _startPlayerId: number;
  private _trumpSuit: Suit;
  private _scoreCard: ScoreCardV2;
  private _totalHandsToPlay: number;
  private _handsPlayed: number;
  private _gameState: GameStateV2;
  private _onPlayPhaseDoneCallback: () => void;
  constructor(players: IPlayer[], gameState: GameStateV2, scoreCard: ScoreCardV2, onPlayPhaseDoneCallback: () => void) {
    this._players = players;
    this._gameState = gameState;
    this._scoreCard = scoreCard;
    this._onPlayPhaseDoneCallback = onPlayPhaseDoneCallback;
    this._handManager = new HandManager(this._players, this._gameState, (winnerId) => this.onHandDone(winnerId));
  }

  public getCurrentPlayerId() {
    return this._handManager.getCurrentPlayerId();
  }

  public startPlayPhase(startPlayerId: number, trumpSuit: Suit, totalHandsToPlay: number) {
    this._startPlayerId = startPlayerId;
    this._trumpSuit = trumpSuit;
    this._totalHandsToPlay = totalHandsToPlay;
    this._handsPlayed = 0;
    this._handManager.startHand(this._startPlayerId, this._trumpSuit);
  }

  public playCard(playerId: number, playedCard: ICard) {
    this._handManager.playCard(playerId, playedCard);
  }

  private onHandDone(winnerId: number) {
    this._scoreCard.scoreWinner(winnerId);
    this._handsPlayed = this._handsPlayed + 1;
    this.clearSelectedCard();
    if (this._handsPlayed === this._totalHandsToPlay) {
      this._onPlayPhaseDoneCallback();
    }
    else {
      this._handManager.startHand(winnerId, this._trumpSuit);
    }
  }

  private clearSelectedCard() {
    this._players.forEach(player => {
      player.selectedCard = null;
    });
  }
}