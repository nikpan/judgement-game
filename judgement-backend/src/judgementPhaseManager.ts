import { IPlayer } from "./player";
import { ScoreCardV2 } from "./scorecardV2";

enum JudgementPhase {
    NotStarted,
    Started,
    Finished
}

/**
  * JudgementPhaseManager - Ensures everyone has set judgement correctly
  * 1. Start with currentPlayer = startPlayer
  * 2. Wait for judgement from currentPlayer
  * 3. If that player gives judgement then update currentPlayer to the next player
  * 4. Repeat until all players set judgement
  * 5. End judgement phase
  * 
  * Interface
  * -> SetJudgement
  * 
  * <- Update scores (judgement part)
  */
export class JudgementPhaseManager {
    public getCurrentPlayerId() {
        return this._currentPlayerId;
    }
    private _players: IPlayer[];
    private _onJudgementPhaseDoneCallback: () => void;
    private _startPlayerId: number;
    private _currentPlayerId: number;
    private _totalHandsToPlay: number;
    private _totalPredictionHands: number
    private _scoreCard: ScoreCardV2;
    private _state: JudgementPhase = JudgementPhase.NotStarted;
    constructor(players: IPlayer[]) {
        this._players = players;
    }

    public startJudgementPhase(startPlayerId: number, totalHands: number, scoreCard: ScoreCardV2, onJudgementPhaseDone: () => void) {
        this._startPlayerId = startPlayerId;
        this._currentPlayerId = startPlayerId;
        this._totalHandsToPlay = totalHands;
        this._totalPredictionHands = 0;
        this._scoreCard = scoreCard;
        this._onJudgementPhaseDoneCallback = onJudgementPhaseDone;
        this._state = JudgementPhase.Started;
    }

    private canTakeAction(playerId: number) {
        if (this._state !== JudgementPhase.Started) {
            throw new Error('cannot setJudgement not yet started!');
        }
        return playerId === this._currentPlayerId;
    }

    public setJudgement(playerId: number, prediction: number) {
        if (this._state !== JudgementPhase.Started) {
            throw new Error(`Judgement phase not yet started. HandState: ${this._state}`);
        }
        if (!this.canTakeAction(playerId)) {
            throw new Error('Player took set judgement action out of turn!');
        }
        // Last player to set judgement
        if (this.nextTurnPlayerId(playerId) === this._startPlayerId && this._totalPredictionHands + prediction === this._totalHandsToPlay) {
            throw new Error(`Can't set prediction! Choose other prediction value`);
        }

        // Perform action
        this._scoreCard.setJudgement(playerId, prediction);
        this._totalPredictionHands = this._totalPredictionHands + prediction;

        // Update current player
        this._currentPlayerId = this.nextTurnPlayerId(this._currentPlayerId);

        // All players done
        if (this._currentPlayerId === this._startPlayerId) {
            this._state = JudgementPhase.Finished;
            this._onJudgementPhaseDoneCallback();
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
}