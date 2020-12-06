import React from 'react';
import './App.css';
import { ICard, Rank, Suit } from './components/card';
import { TextField, PrimaryButton as Button, Stack, ITextField } from 'office-ui-fabric-react';
import ScoreCard from './components/scorecard';
import InfoTable from './components/infoTable';
import Table from './components/table';
import { ErrorMessage, Message, MessageType, PlayerHandMessage, PlayerInfo, PlayerInfoMessage, PlayerScoreMessage } from './controllers/message';

export interface AppState {
  webSocket: WebSocket | null;
  name: string;
  cards: ICard[];
  otherPlayers: PlayerInfo[];
  selectedCard: ICard | null;
  currentSuit: Suit;
  trumpSuit: Suit;
  currentPlayerName: string | null;
  scores: JudgementScore[] | null;
}

export interface JudgementScore {
  playerName: string;
  scores: Score[];
  total: number;
}

export interface Score {
  judgement: number;
  hands: number;
  isFinished: boolean;
}

class App extends React.Component<{}, AppState> {
  private _judgementText: React.RefObject<ITextField> = React.createRef<ITextField>();
  constructor(props: any) {
    super(props);
    this.state = {
      webSocket: null,
      name: '',
      cards: [],
      otherPlayers: [],
      selectedCard: null,
      currentSuit: Suit.Spades,
      trumpSuit: Suit.Spades,
      currentPlayerName: null,
      scores: null
    };
  }

  componentDidMount() {
  }

  openConnection = () => {
    const ws = new WebSocket('ws://localhost:3001');
    // const ws = new WebSocket('wss://judgementgame-backend.azurewebsites.net:3001');
    this.setState({ webSocket: ws });
    ws.onopen = () => {
      console.debug('Connection established!');
      this.sendServerMessage({
        action: MessageType.Join,
        name: this.state.name
      });
    };
    ws.onmessage = (msg) => {
      var message = JSON.parse(msg.data);
      this.handleServerMessage(message as Message);
      console.log('Message from server:');
      console.debug(message);
    };
  }

  closeConnection = () => {
    if (this.state.webSocket != null) {
      this.state.webSocket.close();
    }
  }

  handleChange = (event: any) => {
    this.setState({ name: event.target.value });
  }

  onSetNameClick = () => {
    this.closeConnection();
    this.openConnection();
  }

  onDealClick = () => {
    this.sendServerMessage({
      action: MessageType.Deal
    });
  }

  onCardClick = (suit: Suit, rank: Rank) => {
    if (this.state.selectedCard != null) return;
    this.sendServerMessage({
      action: MessageType.PlayCard,
      card: {
        suit: suit,
        rank: rank
      }
    });
    console.log(suit + rank);
  }

  onSetPrediction = () => {
    if (this._judgementText.current == null) {
      return;
    }

    let prediction = this._judgementText.current.value;
    prediction = prediction ? prediction : "";
    this.sendServerMessage({
      action: MessageType.SetJudgement,
      prediction: parseInt(prediction)
    });

    console.log(this._judgementText.current.value);
  }

  render = () => {
    return (
      <div>
        <h1>
          Judgement Game {this.state.name ? `- ${this.state.name}` : ''}
        </h1>
        <ScoreCard scores={this.state.scores}></ScoreCard>
        <Stack gap={10} padding={10}>
          <Stack horizontal gap={10}>
            <TextField value={this.state.name} onChange={this.handleChange} placeholder='Your Name' />
            <Button onClick={this.onSetNameClick}>Submit</Button>
          </Stack>
          <Button onClick={this.onDealClick}>Deal!</Button>
          <Stack horizontal gap={10}>
            <TextField componentRef={this._judgementText} placeholder={'Your Prediction'} />
            <Button onClick={this.onSetPrediction}>Set Prediction</Button>
          </Stack>
          <InfoTable {...this.state} />
        </Stack>
        <Table {...this.state} onCardClick={this.onCardClick} />
      </div>
    );
  }

  private sendServerMessage(message: any) {
    if (this.state.webSocket == null) {
      alert(`Error: Can't send message because websocket is null`);
      return;
    }

    this.state.webSocket.send(JSON.stringify(message));
  }

  private handleServerMessage(msgData: Message) {
    if (msgData.action === MessageType.Hand) {
      msgData = msgData as PlayerHandMessage;
      this.handlePlayerHandMessage(msgData);
    }
    else if (msgData.action === MessageType.AllPlayers) {
      msgData = msgData as PlayerInfoMessage;
      this.handlePlayerInfoMessage(msgData);
    }
    else if (msgData.action === MessageType.Error) {
      msgData = msgData as ErrorMessage;
      this.handleErrorMessage(msgData);
    }
    else if (msgData.action === MessageType.AllScores) {
      msgData = msgData as PlayerScoreMessage;
      this.handleAllScoresMessage(msgData);
    }
  }

  private handleAllScoresMessage(message: PlayerScoreMessage) {
    console.debug(message.scores);
    this.setState({
      scores: message.scores
    });
  }

  private handleErrorMessage(message: ErrorMessage) {
    alert(`Error: ${message.code}`);
  }

  private handlePlayerInfoMessage(message: PlayerInfoMessage) {
    let otherPlayerInfos = message.players;
    let toRemove = otherPlayerInfos.findIndex((player: {
      name: string;
    }) => player.name === this.state.name);
    let myInfo = otherPlayerInfos.splice(toRemove, 1)[0];
    this.setState({
      otherPlayers: otherPlayerInfos,
      selectedCard: myInfo.selectedCard,
      trumpSuit: message.trumpSuit!,
      currentSuit: message.currentSuit!,
      currentPlayerName: message.currentPlayerName!
    });
  }

  private handlePlayerHandMessage(message: PlayerHandMessage) {
    var cardsFromServer = message.cards;
    this.setState({ cards: cardsFromServer });
  }
}

export default App;
