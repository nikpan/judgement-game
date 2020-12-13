import { ICard, Suit } from "./card";
import StandardDeck from "./deck";
import { JudgementPhaseManager } from "./judgementPhaseManager";
import { GameState } from "./message";
import { IPlayer } from "./player";
import { PlayPhaseManager } from "./playPhaseManger";
import { GameStateV2 } from "./roomV2";
import { ScoreCardV2 } from "./scorecardV2";

enum RoundState {
    NotStarted,
    JudgementPhase,
    PlayPhase,
    Finished
}

/**
   * RoundManager - Ensures one complete round of game is played correctly
   * 1. Start judgement phase with startPlayer = next to dealer
   * 2. On judgement phase end start play phase with startPlayer = next to dealer
   * 3. On playing phase end update scores
   * 4. End round
   * 
   * Interface
   * -> PlayCard
   * -> SetJudgement
   * 
   * <- Update scores
   * <- Update game state
   */
export class RoundManager {
    public getCurrentPlayerId() {
        if (this._state === RoundState.JudgementPhase) {
            return this._judgementPhaseManager.getCurrentPlayerId();
        }
        else if (this._state === RoundState.PlayPhase) {
            return this._playPhaseManager.getCurrentPlayerId();
        }
        else {
            return 0;
        }
    }
    private _players: IPlayer[];
    private _judgementPhaseManager: JudgementPhaseManager;
    private _playPhaseManager: PlayPhaseManager;
    private _scoreCard: ScoreCardV2;
    private _dealerId: number;
    private _trumpSuit: Suit;
    private _totalHandsToPlay: number;
    private _deck: StandardDeck;
    private _state: RoundState;
    private _gameState: GameStateV2;
    private _onRoundDoneCallback: () => void;
    constructor(gameState: GameStateV2) {
        this._gameState = gameState;
        this._judgementPhaseManager = new JudgementPhaseManager();
        this._playPhaseManager = new PlayPhaseManager(this._gameState);
        this._deck = new StandardDeck();
        this._state = RoundState.NotStarted;
    }

    public startRound(players: IPlayer[], dealerId: number, scoreCard: ScoreCardV2, totalHandsToPlay: number, trumpSuit: Suit, onRoundDoneCallback: () => void) {
        this._players = players;
        this._dealerId = dealerId;
        this._scoreCard = scoreCard;
        this._totalHandsToPlay = totalHandsToPlay;
        this._trumpSuit = trumpSuit;
        this._gameState.trumpSuit = trumpSuit;
        this._gameState.state = GameState.WaitingForPlayerToSetJudgement;
        this._onRoundDoneCallback = onRoundDoneCallback;
        let nextPlayerId = this.nextTurnPlayerId(this._dealerId);
        this.dealCardsToPlayers(totalHandsToPlay);
        this._state = RoundState.JudgementPhase;
        this._judgementPhaseManager.startJudgementPhase(this._players, nextPlayerId, this._totalHandsToPlay, scoreCard, () => this.onJudgementPhaseDone());
        this._scoreCard.startRound();
    }

    public setJudgement(playerId: number, prediction: number) {
        this._judgementPhaseManager.setJudgement(playerId, prediction);
    }

    public playCard(playerId: number, playedCard: ICard) {
        this._playPhaseManager.playCard(playerId, playedCard);
    }

    private onJudgementPhaseDone() {
        let nextPlayerId = this.nextTurnPlayerId(this._dealerId);
        this._state = RoundState.PlayPhase;
        this._gameState.state = GameState.WaitingForPlayerToPlayCard;
        this._playPhaseManager.startPlayPhase(this._players, nextPlayerId, this._trumpSuit, this._scoreCard, this._totalHandsToPlay, () => this.onPlayPhaseDone());
    }

    private onPlayPhaseDone(): void {
        this._scoreCard.endRound();
        this._onRoundDoneCallback();
        this._state = RoundState.Finished;
    }

    private dealCardsToPlayers(numberOfCards: number) {
        this._deck.resetDeck();

        this._players.forEach(player => {
            const hand = this._deck.drawRandom(numberOfCards);
            player.hand = hand;
            player.sendHand();
        });

    }

    private nextTurnPlayerId(playerId: number): number {
        const nextPlayerIndex = this.nextTurnPlayerIndex(playerId);
        return this._players[nextPlayerIndex].id;
    }

    private nextTurnPlayerIndex(playerId: number): number {
        const playerIndex = this.playerIndexById(playerId);
        const nextPlayerIndex = (playerIndex + 1) % this._players.length;
        return nextPlayerIndex;
    }

    private playerIndexById(playerId: number): number {
        return this._players.findIndex(player => player.id === playerId);
    }
}