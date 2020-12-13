import { ICard, Suit, Winner } from "./card";
import { IPlayer } from "./player";
import { GameStateV2 } from "./roomV2";

const enum HandState {
    NotStarted,
    Started,
    Finished
}

/**
 * HandManager - Ensures one trick/hand is played correctly
 * 1. Start hand with currentPlayer = startPlayer 
 * 2. Wait for card from currentPlayer
 * 3. If that player plays card then update currentPlayer to the next player
 * 4. Repeat until all players played
 * 5. End hand and return the winner.
 * 
 * Interface
 * -> PlayCard
 * 
 * <- Update selected card
 * <- Winner
 */
export class HandManager {
    public getCurrentPlayerId() {
        return this._currentPlayerId;
    }
    private _players: IPlayer[];
    private _startPlayerId: number;
    private _currentPlayerId: number;
    private _state: HandState = HandState.NotStarted;
    private _currentSuit: Suit;
    private _trumpSuit: Suit;
    private _gameState: GameStateV2;
    private _handDoneCallback: (winnerId: number) => void;
    constructor(gameState: GameStateV2) {
        this._gameState = gameState;
    }

    public startHand(players: IPlayer[], startPlayerId: number, trumpSuit: Suit, onHandDone: (winnerId: number) => void) {
        this._players = players;
        this._startPlayerId = startPlayerId;
        this._currentPlayerId = startPlayerId;
        this._currentSuit = null;
        this._trumpSuit = trumpSuit;
        this._state = HandState.Started;
        this._handDoneCallback = onHandDone;
    }

    private canPlayCard(playerId: number): boolean {
        if (this._state !== HandState.Started) {
            throw new Error('Round not yet started!');
        }
        return playerId === this._currentPlayerId;
    }

    public playCard(playerId: number, playedCard: ICard): void {
        if (this._state !== HandState.Started) {
            throw new Error(`Hand not yet started. HandState: ${this._state}`);
        }
        if (!this.canPlayCard(playerId)) {
            throw new Error('Player took play card action out of turn!');
        }

        // Perform action
        if (this.firstCard()) {
            this._currentSuit = playedCard.suit;
            this._gameState.currentSuit = this._currentSuit;
        }
        this.getPlayerById(playerId).selectedCard = playedCard;

        // Update current player
        this._currentPlayerId = this.nextTurnPlayerId(this._currentPlayerId);

        // All players done
        if (this._currentPlayerId === this._startPlayerId) {
            this._state = HandState.Finished;
            this._handDoneCallback(this.calcWinnerId());
        }
    }

    private firstCard(): boolean {
        return this._currentPlayerId == this._startPlayerId;
    }

    private calcWinnerId(): number {
        let winner = 0;
        for (let i = 0; i < this._players.length; i++) {
            const player = this._players[i];
            if (Winner(this._players[winner].selectedCard, player.selectedCard, this._trumpSuit, this._currentSuit) === -1) {
                winner = i;
            }
        }
        return this._players[winner].id;
    }

    public init(players: IPlayer[], dealerId: number) {
        this._players = players;
        this._startPlayerId = dealerId;
    }

    public isPlayerTurn(playerId: number) {
        if (this._currentPlayerId === 0) {
            this._currentPlayerId = playerId;
        }
        return playerId === this._currentPlayerId;
    }

    private nextTurnPlayerIndex(playerId: number): number {
        const playerIndex = this.playerIndexById(playerId);
        const nextPlayerIndex = (playerIndex + 1) % this._players.length;
        return nextPlayerIndex;
    }

    private nextTurnPlayer(playerId: number): IPlayer {
        const nextPlayerIndex = this.nextTurnPlayerIndex(playerId);
        return this._players[nextPlayerIndex];
    }

    private nextTurnPlayerId(playerId: number): number {
        const nextPlayerIndex = this.nextTurnPlayerIndex(playerId);
        return this._players[nextPlayerIndex].id;
    }

    private playerIndexById(playerId: number): number {
        return this._players.findIndex(player => player.id === playerId);
    }

    private getPlayerById(playerId: number): IPlayer {
        const playerIndex = this.playerIndexById(playerId);
        return this._players[playerIndex];
    }
}