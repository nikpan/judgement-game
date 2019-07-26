import React, { CSSProperties } from "react";
import { DetailsList, DetailsListLayoutMode, IColumn } from "office-ui-fabric-react";
import { JudgementScore, Score } from "../App";

export interface ScoreCardProps {
  scores: JudgementScore[] | null;
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
      }
      return (
        score.hands == score.judgement ? <span style={green}>{score.hands*10}</span> : <span style={red}>0</span>
      )
    }
  }

  renderTotal(total: number) {
    return (
      <span><b>{total}</b></span>
    )
  }
  
  render() {
    let scores = this.props.scores;
    let columns: IColumn[] = [];
    let items:any[] = [];
    if(scores) {
      let i=0;
      scores.forEach(sc => {
        columns.push({
          key: 'column' + i,
          name: sc.playerName,
          fieldName: sc.playerName,
          minWidth: 100,
          maxWidth: 200,
          isResizable: true
        })
        i+=1;
      });
      
      let length = scores && scores[0] && scores[0].scores && scores[0].scores.length ? scores[0].scores.length : 0;
      for (let i = 0; i < length; i++) {
        items.push({});
        scores.forEach(sc=> {
          items[i][sc.playerName] = this.renderScore(sc.scores[i], sc.scores[i].isFinished);
        })
      }
      items.push({});
      scores.forEach(sc => {
        items[length][sc.playerName] = this.renderTotal(sc.total);
      })
      console.debug(items);
      console.debug(columns);
    }

    return (
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
         />
    )
  }
}