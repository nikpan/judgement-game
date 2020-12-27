import { Stack, TextField, PrimaryButton as Button, ITextField } from 'office-ui-fabric-react';
import React from 'react';
import { Suit, Rank, ICard } from '../components/card';
import InfoTable from '../components/infoTable';
import ScoreCard, { PlayerScore } from '../components/scorecard';
import Table from '../components/table';
import { Utils } from '../utils/utils';
import { ClientGameState, PlayerInfo } from '../controllers/message';

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
  private _judgementText: React.RefObject<ITextField> = React.createRef<ITextField>();
  
  constructor(props: any) {
    super(props);
  }

  render = () => {
    return (
      <Stack gap={10} padding={10} >
      <Stack horizontal gap={10}>
        <TextField contentEditable={this.props.predictionEditable} componentRef={this._judgementText} placeholder={'Your Prediction'} />
        <Button disabled={!this.props.predictionEditable} onClick={this.onSetPrediction}>Set Prediction</Button>
      </Stack>
      <ScoreCard scores={this.props.scores}></ScoreCard>
      <InfoTable {...this.props} />
      <Table {...this.props} onCardClick={this.onCardClick} />
    </Stack>
    )
  }

  onSetPrediction = () => {
    if (this._judgementText.current == null || Utils.IsNullOrUndefined(this._judgementText.current.value)) {
      Utils.showErrorPopup(`Prediction can't be empty`);
      return;
    }
    const prediction = parseInt(this._judgementText.current.value!);
    if(isNaN(prediction)) {
      Utils.showErrorPopup(`Prediction has to be a number`);
      return;
    }

    this.props.onSetPrediction(prediction);
  }

  onCardClick = (suit: Suit, rank: Rank) => {
    this.props.onCardClick(suit, rank);
  }
}