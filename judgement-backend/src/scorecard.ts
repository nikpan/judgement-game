export interface JudgementScore {
  playerName: string;
  scores: Score[];
  total: number;
}

interface Score {
  judgement: number;
  hands: number;
  isFinished: boolean;
}

interface IScoreCard {
  setJudgement(playerName: string, prediction: number): any;
  scoreWinner(playerName: string): any;
  calcTotals(): any;
  getScores(): JudgementScore[];
  startRound(maxHandsInRound: number): any;
  endRound(): any;
}

class ScoreCard implements IScoreCard {
  private _scores: JudgementScore[];
  private _currentRoundIndex: number;
  private _maxHandsInRound: number;
  private _dealerIndex: number;
  private _handsDone: number;
  constructor(players: string[]) {
    this._scores = [];
    this._currentRoundIndex = -1;
    this._dealerIndex = 0;
    this._maxHandsInRound = 0;
    players.forEach(p => {
      this._scores.push(
        {
          playerName: p,
          scores: [],
          total: 0
        }
      )
    });
  }

  startRound(maxHandsInRound: number): any {
    this._scores.forEach(p => {
      p.scores.push({hands: 0, judgement: 0, isFinished: false});
    })
    this._maxHandsInRound = maxHandsInRound;
    this._currentRoundIndex = this._scores[0].scores.length-1;
  }

  setJudgement(playerName: string, prediction: number) {
    let playerScoreIndex = this._scores.findIndex(sc => sc.playerName === playerName);
    if(playerScoreIndex == -1) {
      console.log("ScoreCardError::Can't set judgement for unknown player " + playerName);
      return;
    }

    let playerScore = this._scores[playerScoreIndex];
    if(playerScore.scores[this._currentRoundIndex]) {
      let latestScore = playerScore.scores[this._currentRoundIndex];
      if(playerScoreIndex === this._dealerIndex && this.getRemainingHandsInRound() === prediction) {
        console.log("ScorecardError::Can't set judgement because predication cannot match total hands");
        return;
      }
      latestScore.judgement = prediction;
    }
    else {
      console.log("ScorecardError::Can't set judgement because score array is empty");
    }
  }

  private getRemainingHandsInRound() {
    let remainingHands = this._maxHandsInRound;
    this._scores.forEach(pSc => {
      remainingHands -= pSc.scores[this._currentRoundIndex].judgement;
    });
    return remainingHands;
  }

  endRound(): any {
    this._dealerIndex = (this._dealerIndex+1) % this._scores.length;
    this._handsDone = 0;
    this._scores.forEach(pSc => {
      pSc.scores[this._currentRoundIndex].isFinished = true;
    });
  }

  scoreWinner(playerName: string) {
    let playerScoreIndex = this._scores.findIndex(sc => sc.playerName === playerName);
    if(playerScoreIndex == -1) {
      console.log("ScorecardError::Can't score winner for unknown player " + playerName);
      return;
    }
    
    let playerScore = this._scores[playerScoreIndex];
    if(playerScore.scores[this._currentRoundIndex]) {
      let latestScore = playerScore.scores[this._currentRoundIndex];
      latestScore.hands = latestScore.hands + 1;
      this._handsDone += 1;
      if(this._handsDone === this._maxHandsInRound) {
        this.endRound();
      }
    }
    else {
      console.log("ScorecardError::Can't score winner because score array is empty");
    }
  }
  
  calcTotals() {
    this._scores.forEach(pl => {
      let total = 0;
      pl.scores.forEach(score => {
        if(score.isFinished)
          total += score.hands == score.judgement ? 10+score.hands : 0;
      });
      pl.total = total;
    });
  }
  getScores(): JudgementScore[] {
    this.calcTotals();
    return this._scores;
  }  
}

export default ScoreCard;