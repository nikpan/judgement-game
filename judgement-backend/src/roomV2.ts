import { Suit, ICard } from "./card";
import { GameState, MessageType, PlayerInfoMessage, PlayerScoreMessage } from "./message";
import { IPlayer } from "./player";
import { ScoreCardV2 } from "./scorecardV2";
import { TableManager } from "./tableManager";

export interface GameStateV2 {
    state: GameState;
    currentSuit: Suit;
    trumpSuit: Suit;
}

export class RoomV2 {
    private _players: IPlayer[];
    private _tableManager: TableManager;
    private _scoreCard: ScoreCardV2;
    private _gameState: GameStateV2;

    constructor() {
        this._players = [];
        this._gameState = {
            currentSuit: null,
            trumpSuit: null,
            state: GameState.WaitingForPlayersToJoin
        };
        this._scoreCard = new ScoreCardV2();
        this._tableManager = new TableManager(this._players, this._gameState, this._scoreCard);
    }

    public get scoreCard() {
        return this._scoreCard;
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

    private getCurrentPlayerId(): number {
        return this._tableManager.getCurrentPlayerId();
    }

    private getCurrentPlayerName(): string {
        const currentPlayerId = this.getCurrentPlayerId();
        return this.playerNameByPlayerId(currentPlayerId);
    }

    public deal(dealerId: number) {
        this._scoreCard.init(this._players);
        this._tableManager.startGame(dealerId);
    }

    public playCard(playerId: number, playedCard: ICard) {
        this._tableManager.playCard(playerId, playedCard);
        this.sendPlayerInfoToAll();
    }

    public setJudgement(playerId: number, prediction: number) {
        this._tableManager.setJudgement(playerId, prediction);
    }

    public removePlayer(playerId: number) {
        var toRemove = this._players.findIndex(p => p.id === playerId);
        this._players.splice(toRemove, 1);
        this.sendPlayerInfoToAll();
    }

    public join(player: IPlayer) {
        this._players.push(player);
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
        }
        this._players.forEach(clientWs => {
            clientWs.sendMessage(allPlayerScores);
        });
    }
}