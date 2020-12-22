import { Suit, ICard } from "./card";
import { ClientGameState, GameStateMessage, JoinCompleteMessage, MessageType, PlayerInfoMessageV2, PlayerListMessage, PlayerScoreMessage } from "./message";
import { IPlayer } from "./player";
import { ScoreCardV2 } from "./scorecardV2";
import { TableManager } from "./tableManager";

export interface GameState {
    currentSuit: Suit;
    trumpSuit: Suit;
    clientState: ClientGameState;
}

export class Room {
    private _roomCode: string;
    private _players: IPlayer[];
    private _tableManager: TableManager;
    private _scoreCard: ScoreCardV2;
    private _gameState: GameState;
    private _updateTimer: NodeJS.Timeout;
    private _timerStartTimestamp: number;
    private _playerListTimer: NodeJS.Timeout;

    constructor(roomCode: string) {
        this._roomCode = roomCode;
        this._players = [];
        this._gameState = {
            currentSuit: null,
            trumpSuit: null,
            clientState: ClientGameState.WaitingToStartGame
        };
        this._scoreCard = new ScoreCardV2();
        this._tableManager = new TableManager(this._players, this._gameState, this._scoreCard);
    }

    private sendPlayerListMessageToAll() {
        const playerListMessage: PlayerListMessage = {
            action: MessageType.PlayerList,
            roomCode: this._roomCode,
            playerList: this.getPlayerNameList()
        };
        this._players.forEach(player => {
            player.sendMessage(playerListMessage);
        });
    }

    public getPlayerNameList() {
        let playerList = [];
        this._players.forEach(player => playerList.push(player.name));
        return playerList;
    }

    public get scoreCard() {
        return this._scoreCard;
    }

    public sendPlayerInfoV2ToAll() {
        let playerInfoMessage: PlayerInfoMessageV2 = {
            action: MessageType.PlayerInfo,
            players: this.gatherAllPlayerInfo(),
        }
        this._players.forEach(clientWs => {
            clientWs.sendMessage(playerInfoMessage)
        });
    }

    public sendGameStateInfoToAll() {
        let gameStateInfoMessage: GameStateMessage = {
            action: MessageType.GameStateInfo,
            currentSuit: this._gameState.currentSuit,
            trumpSuit: this._gameState.trumpSuit,
            currentPlayerName: this.getCurrentPlayerName(),
            firstTurnPlayerName: this.getFirstTurnPlayerName(),
            gameState: this._gameState.clientState
        }
        this._players.forEach(clientWs => {
            clientWs.sendMessage(gameStateInfoMessage);
        })
    }

    private gatherAllPlayerInfo() {
        let playerInfos = [];
        this._players.forEach(player => {
            playerInfos.push({
                name: player.name,
                cardCount: player.hand.length,
                selectedCard: player.selectedCard
            });
        });
        return playerInfos;
    }

    private getCurrentPlayerId(): number {
        return this._tableManager.getCurrentPlayerId();
    }

    private getCurrentPlayerName(): string {
        const currentPlayerId = this.getCurrentPlayerId();
        return this.playerNameByPlayerId(currentPlayerId);
    }

    private getFirstTurnPlayerId(): number {
        return this._tableManager.getFirstTurnPlayerId();
    }

    private getFirstTurnPlayerName(): string {
        const firstTurnPlayerId = this.getFirstTurnPlayerId();
        return this.playerNameByPlayerId(firstTurnPlayerId);
    }

    public startGame(dealerId: number) {
        clearInterval(this._playerListTimer);
        this._scoreCard.init(this._players);
        this._tableManager.startGame(dealerId);
        this.sendAllInfo();
    }

    private sendAllInfo() {
        this.sendGameStateInfoToAll();
        this.sendScoresToAll();
        this.sendPlayerInfoV2ToAll();
    }

    public playCard(playerId: number, playedCard: ICard) {
        this._tableManager.playCard(playerId, playedCard);
    }

    public setJudgement(playerId: number, prediction: number) {
        this._tableManager.setJudgement(playerId, prediction);
        this.sendAllInfo();
        this.sendScoresToAll();
    }

    public removePlayer(playerId: number) {
        var toRemove = this._players.findIndex(p => p.id === playerId);
        this._players.splice(toRemove, 1);
    }

    public join(player: IPlayer) {
        this._players.push(player);
        this.sendPlayerListMessageToAll();
    }

    private playerNameByPlayerId(playerId: number) {
        const playerIndex = this._players.findIndex(p => p.id === playerId);
        if (playerIndex === -1) return "";
        const player = this._players[playerIndex];
        return player.name;
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

    public playerStateUpdated() {
        const currentTimeStamp = Date.now();
        console.log(`starting timer 3. timer: ${this._updateTimer}, startTimeStamp: ${this._timerStartTimestamp}, currentTimeStamp: ${currentTimeStamp}`);
        if( this._updateTimer && currentTimeStamp - this._timerStartTimestamp < 100) {
            clearTimeout(this._updateTimer);
            console.log(`starting timer 4. timer: ${this._updateTimer}, startTimeStamp: ${this._timerStartTimestamp}, currentTimeStamp: ${currentTimeStamp}`);
        } 
        this.startTimer();
    }
    
    private startTimer() {
        console.log('starting timer 1');
        this._timerStartTimestamp = Date.now();
        this._updateTimer = setTimeout(() => {
            console.log('starting timer 2');
            this.sendAllInfo();
            this._timerStartTimestamp = 0;
            this._updateTimer = null;
        }, 100);
    }

    public dispose() {
        this._players.forEach(player => {
            player.dispose();
        });
        delete this._players;
        delete this._scoreCard;
        delete this._tableManager;
        delete this._gameState;
        delete this._timerStartTimestamp;
        delete this._updateTimer;
      }
}