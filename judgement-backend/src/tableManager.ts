import { ICard, Suit } from "./card";
import { MessageType, PlayerInfoMessage, PlayerScoreMessage } from "./message";
import { IPlayer } from "./player";
import { GameStateV2 } from "./roomV2";
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

    private _players: IPlayer[];
    private _roundManager: RoundManager;
    private _totalRounds: number;
    private _roundsDone: number;
    private _scoreCard: ScoreCardV2;
    private _dealerId: number;
    private _gameState: GameStateV2;

    constructor(players: IPlayer[], gameState: GameStateV2, scoreCard: ScoreCardV2) {
        this._players = players;
        this._gameState = gameState;
        this._scoreCard = scoreCard;
        this._roundManager = new RoundManager(this._players, this._gameState, this._scoreCard, () => this.onRoundDone());
    }

    public startGame(dealerId: number) {
        // this._totalRounds = 52 % this._players.length;
        this._totalRounds = 4;
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
                this.sendPlayerInfoToAll();
            }, 5000);
        }
        console.log('All Rounds Done!');
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

    public sendPlayerInfoToAll() {
        let playerInfoMessage: PlayerInfoMessage = {
            action: MessageType.AllPlayers,
            players: this.gatherAllPlayerInfo(),
            currentSuit: this._gameState.currentSuit,
            trumpSuit: this._gameState.trumpSuit,
            currentPlayerName: this.getCurrentPlayerName(),
            gameState: this._gameState.state
        }
        this._players.forEach(clientWs => {
            clientWs.sendMessage(playerInfoMessage)
        });

        this.sendScoresToAll();
    }

    private getCurrentPlayerName(): string {
        const currentPlayerId = this.getCurrentPlayerId();
        return this.playerNameByPlayerId(currentPlayerId);
    }

    private playerNameByPlayerId(playerId: number) {
        const playerIndex = this._players.findIndex(p => p.id === playerId);
        if (playerIndex === -1) return "";
        const player = this._players[playerIndex];
        return player.name;
    }

    private gatherAllPlayerInfo() {
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

    private sendScoresToAll(): void {
        let playerScores = this._scoreCard.getScores();
        playerScores.forEach(score => {
            score.playerName = this.playerNameByPlayerId(score.playerId)
        });
        let allPlayerScores: PlayerScoreMessage = {
            action: MessageType.AllScores,
            scores: playerScores
        };
        this._players.forEach(clientWs => {
            clientWs.sendMessage(allPlayerScores);
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

    public setJudgement(playerId: number, prediction: number) {
        this._roundManager.setJudgement(playerId, prediction);
    }

    public playCard(playerId: number, playedCard: ICard) {
        this._roundManager.playCard(playerId, playedCard);
    }
}