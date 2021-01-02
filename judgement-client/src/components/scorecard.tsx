import React from "react";
import './scorecard.css';

export interface PlayerScore {
  playerName: string;
  scores: Score[];
  total: number;
}

export interface Score {
  judgement: number;
  hands: number;
  isFinished: boolean;
}

export interface ScoreCardProps {
  scores: PlayerScore[] | null;
}

export default class ScoreCard extends React.Component<ScoreCardProps> {
  renderScore(score: Score, isRoundFinished: boolean) {
    if(!isRoundFinished) {
      return (
        <span>{score.hands}/{score.judgement}</span>
        )
    }
    else {
      let green = {
        color: 'green'
      };
      let red = {
        color: 'red'
      };
      let strikeThrough = {
        textDecoration: 'line-through'
      };
      if(score.hands == score.judgement) {
        return (
          <span style={green}>{score.hands+10}</span>
        )
      }
      else {
        return (
          <>
            <span style={red}> 0 </span>
            <span style={strikeThrough}>{score.hands}/{score.judgement}</span>
          </>
        )
      }
    }
  }

  renderTotal(total: number) {
    return (
      <span><b>{total}</b></span>
    )
  }
  
  renderScorecard = () => {
    let scores = this.props.scores;
    const columns: any[] = [];
    scores && scores!.forEach(sc => {
      columns.push(this.renderColumn(sc));
    });
    return (
      <div className='scorecard-container'>
        <div className='scorecard-title'>Points Table</div>
        <div className='scorecardV2' style={{display:'flex'}}>
          {columns}
        </div>
      </div>
    )
  }

  private renderColumn(playerScore: PlayerScore): any {
    let scores: JSX.Element[] = [];
    playerScore.scores.forEach(sc => {
      scores.push(this.renderScore(sc, sc.isFinished));
      scores.push(<br/>);
    });
    return (
      <div className='scorecard-column' style={{flexGrow: 1}}>
        <div>
          <span>{playerScore.playerName}</span>
        </div>
        <div>
          {scores}
        </div>
        <div>
          {this.renderTotal(playerScore.total)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderScorecard()}
      </div>
    )
  }
}