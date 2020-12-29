import { Stack } from 'office-ui-fabric-react';
import React from 'react';
import { Suit, Rank, ICard } from '../components/card';
import InfoTable from '../components/infoTable';
import ScoreCard, { PlayerScore } from '../components/scorecard';
import Table from '../components/table';
import { ClientGameState, PlayerInfo } from '../controllers/message';
import PredictionSelector from '../components/predictionSelector';

export interface PlayPageProps {
  predictionEditable: boolean;
  name: string;
  cards: ICard[];
  selectedCard: ICard | null;
  otherPlayers: PlayerInfo[];
  scores: PlayerScore[] | null;
  trumpSuit: Suit;
  currentSuit: Suit | null;
  currentPlayerName: string | null;
  firstTurnPlayerName: string | null;
  currentGameState: ClientGameState;
  onCardClick: (suit: Suit, rank: Rank) => void;
  onSetPrediction: (prediction: number) => void;
}

export default class PlayPage extends React.Component<PlayPageProps> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    return (
    <Stack gap={10} >
      <div style={{padding:10}} className='jHomeHeader'>
        <span style={{fontSize:'25px', fontWeight:'bold'}}>THE</span>
        <br />
        <span style={{fontSize:'35px', fontWeight:'bold'}}>JUDGEMENT</span>
        <br/> 
        <span style={{fontSize:'25px', fontWeight:'bold'}}>GAME</span>
        <br/>
      </div>
      <Table {...this.props} onCardClick={this.onCardClick} />
      <InfoTable {...this.props} />
      <PredictionSelector maxCount={7} onSetPrediction={this.onSetPrediction}></PredictionSelector>
      <ScoreCard scores={this.props.scores}></ScoreCard>
    </Stack>
    )
  }

  onSetPrediction = (prediction: number) => {
    this.props.onSetPrediction(prediction);
  }

  onCardClick = (suit: Suit, rank: Rank) => {
    this.props.onCardClick(suit, rank);
  }
}