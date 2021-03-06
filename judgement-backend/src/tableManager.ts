import { ICard, Suit } from "./card";
import Logger from "./logger";
import { IPlayer } from "./player";
import { GameState } from "./room";
import { RoundManager } from "./roundManager";
import { ScoreCardV2 } from "./scorecardV2";

/**
    * TableManager - Ensures one complete game of judgement is played correctly
    * 1. Wait for players to join
    * 2. Once deal is clicked -> freeze table; no more players joining table
    * 3. Play 'n' rounds, where n = (52 % no_of_players)
    * 
    * Interface
    * -> StartGame
    * -> PlayCard
    * -> SetJudgement 
    * 
    * <- Send scores (scoreboard info)
    * <- Send player cards (my cards? what cards others have played?)
    * <- Send game state (whose turn? what phase?)
    */

export class TableManager {

    public getCurrentPlayerId(): number {
        return this._roundManager.getCurrentPlayerId();
    }

    public getFirstTurnPlayerId(): number {
        return this.nextTurnPlayerId(this._dealerId);
    }

    private _players: IPlayer[];
    private _roundManager: RoundManager;
    private _totalRounds: number;
    private _roundsDone: number;
    private _scoreCard: ScoreCardV2;
    private _dealerId: number;
    private _gameState: GameState;

    constructor(players: IPlayer[], gameState: GameState, scoreCard: ScoreCardV2) {
        this._players = players;
        this._gameState = gameState;
        this._scoreCard = scoreCard;
        this._roundManager = new RoundManager(this._players, this._gameState, this._scoreCard, () => this.onRoundDone());
    }

    public startGame(dealerId: number) {
        this._totalRounds = Math.min(Math.floor(52 / this._players.length), 7);
        // this._totalRounds = 4;
        this._roundsDone = 0;
        this._dealerId = dealerId;
        this._roundManager.startRound(this._dealerId, this.maxHandsInCurrentRound(), this.getCurrentTrumpSuit());
    }

    private onRoundDone(): void {
        this._roundsDone = this._roundsDone + 1;
        this._dealerId = this.nextTurnPlayerId(this._dealerId);
        if (this._roundsDone < this._totalRounds) {
            setTimeout(() => {
                this._roundManager.startRound(this._dealerId, this.maxHandsInCurrentRound(), this.getCurrentTrumpSuit());
            }, 5000);
        }
        Logger.log('All Rounds Done!');
    }

    private maxHandsInCurrentRound() {
        return this._totalRounds - this._roundsDone;
    }

    private getCurrentTrumpSuit(): Suit {
        switch (this._roundsDone % 4) {
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

    public setJudgement(playerId: number, prediction: number) {
        this._roundManager.setJudgement(playerId, prediction);
    }

    public playCard(playerId: number, playedCard: ICard) {
        this._roundManager.playCard(playerId, playedCard);
    }
}