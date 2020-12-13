import { IPlayer } from "./player";
import { Score } from "./scorecard";

export interface JudgementScoreV2 {
    playerId: number;
    playerName?: string;
    scores: Score[];
    total: number;
}

export class ScoreCardV2 {
    private _scores: JudgementScoreV2[];
    constructor() {        
    }

    public init(players: IPlayer[]) {
        this._scores = [];
        players.forEach(p => {
            this._scores.push(
                {
                    playerId: p.id,
                    scores: [],
                    total: 0
                }
            )
        });
    }

    public startRound() {
        this._scores.forEach(p => {
            p.scores.push({ hands: 0, judgement: -1, isFinished: false });
        });
    }

    private getLatestPlayerScore(playerId: number) {
        let playerScores = this.getPlayerScores(playerId);
        if (playerScores.length === 0) {
            console.log(`ScoreCardError::Can't get latest scores because scores array empty`);
            throw new Error('ScoreArrayEmpty');
        }
        let latestPlayerScore = playerScores[playerScores.length - 1];
        return latestPlayerScore;
    }

    private getPlayerScores(playerId: number) {
        let playerScoreIndex = this._scores.findIndex(sc => sc.playerId === playerId);
        if (playerScoreIndex == -1) {
            console.log("ScoreCardError::Can't set judgement for unknown player " + playerId);
            throw new Error('UnknownPlayer');
        }

        let playerScores = this._scores[playerScoreIndex].scores;
        return playerScores;
    }

    public setJudgement(playerId: number, prediction: number) {
        let latestPlayerScore = this.getLatestPlayerScore(playerId);

        if (latestPlayerScore.judgement !== -1) {
            throw new Error(`Can't set judgement for someone already set`);
        }

        if (latestPlayerScore.isFinished) {
            throw new Error(`Can't set judgement when round finished`);
        }

        latestPlayerScore.judgement = prediction;
    }


    public scoreWinner(playerId: number) {
        let latestPlayerScore = this.getLatestPlayerScore(playerId);

        if (latestPlayerScore.isFinished) {
            throw new Error(`Can't set judgement when round finished`);
        }

        latestPlayerScore.hands = latestPlayerScore.hands + 1;
    }

    public endRound() {
        this._scores.forEach(p => {
            let playerScores = p.scores;
            let latestPlayerScore = playerScores[playerScores.length - 1];
            latestPlayerScore.isFinished = true;
        });
    }

    public getScores(): JudgementScoreV2[] {
        this.calcTotals();
        return this._scores;
    }

    calcTotals() {
        this._scores.forEach(pl => {
            let total = 0;
            pl.scores.forEach(score => {
                if (score.isFinished)
                    total += score.hands == score.judgement ? 10 + score.hands : 0;
            });
            pl.total = total;
        });
    }
}