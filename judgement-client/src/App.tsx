import React from 'react';
import './App.css';
import { ICard, Rank, Suit } from './components/card';
import { TextField, PrimaryButton as Button, Stack, ITextField } from 'office-ui-fabric-react';
import ScoreCard from './components/scorecard';
import InfoTable from './components/infoTable';
import Table from './components/table';

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

enum MessageType {
  Deal = 'Deal',
  Join = 'Join',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers',
  PlayCard = 'PlayCard',
  Error = 'Error',
  AllScores = 'AllScores',
  SetJudgement = 'SetJudgement'
}

export interface PlayerInfo {
  name: string;
  cardCount: number;
  selectedCard: ICard | null;
}

interface ServerMessage {
  action: MessageType;
  cards?: ICard[];
  players?: PlayerInfo[];
  card?: ICard;
  name?: string;
  code?: string;
  currentSuit?: Suit | null;
  trumpSuit?: Suit | null;
  currentPlayerName?: string | null;
  scores?: any;
  prediction?: number;
}

class App extends React.Component<{},AppState> {
  private _judgementText: React.RefObject<ITextField> = React.createRef<ITextField>();
  constructor(props:any) {
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
    this.setState({webSocket: ws});
    ws.onopen = () => {
      console.debug('Connection established!');
      var data = {
        action: MessageType.Join,
        name: this.state.name
      };
      ws.send(JSON.stringify(data));
    };
    ws.onmessage = (msg) => {
      var msgData: ServerMessage = JSON.parse(msg.data);
      this.handleServerMessage(msgData);
      console.log('Message from server:');
      console.debug(msgData);
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
    var data = {
      action: MessageType.Deal
    };
    if (this.state.webSocket != null) {
      this.state.webSocket.send(JSON.stringify(data));
    }
  }

  onCardClick = (suit: Suit, rank: Rank) => {
    if(this.state.selectedCard != null) return;
    if(this.state.webSocket != null) {
      this.state.webSocket.send(JSON.stringify({
        action: MessageType.PlayCard,
        card: {
          suit: suit,
          rank: rank
        }
      }))
    }
    console.log(suit + rank);
  }

  onSetPrediction = () => {
    if(this._judgementText.current == null) {
      return;
    }
    if(this.state.webSocket == null) {
      return;
    }

    let prediction = this._judgementText.current.value;
    prediction = prediction ? prediction : "";
    this.state.webSocket.send(JSON.stringify({
      action: MessageType.SetJudgement,
      prediction: parseInt(prediction)
    }));
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
            <TextField value={this.state.name} onChange={this.handleChange} placeholder='Your Name'/>
            <Button onClick={this.onSetNameClick}>Submit</Button>
          </Stack>
          <Button onClick={this.onDealClick}>Deal!</Button>
          <Stack horizontal gap={10}>
            <TextField componentRef={this._judgementText} placeholder={'Your Prediction'}/>
            <Button onClick={this.onSetPrediction}>Set Prediction</Button>
          </Stack>
          <InfoTable {...this.state} />
        </Stack>
        <Table {...this.state} onCardClick={this.onCardClick} />
      </div>
    );
  }

  private handleServerMessage(msgData: ServerMessage) {
    if (msgData.action === MessageType.Hand && msgData.cards) {
      var cardsFromServer = msgData.cards;
      this.setState({ cards: cardsFromServer });
    }
    if (msgData.action === MessageType.AllPlayers && msgData.players) {
      let otherPlayerInfos = msgData.players;
      let toRemove = otherPlayerInfos.findIndex((player: {
        name: string;
      }) => player.name === this.state.name);
      let myInfo = otherPlayerInfos.splice(toRemove, 1)[0];
      this.setState({
        otherPlayers: otherPlayerInfos,
        selectedCard: myInfo.selectedCard,
        trumpSuit: msgData.trumpSuit!,
        currentSuit: msgData.currentSuit!,
        currentPlayerName: msgData.currentPlayerName!
       });
    }
    if(msgData.action === MessageType.Error && msgData.code){
      alert(`Error: ${msgData.code}`);
    }
    if(msgData.action === MessageType.AllScores && msgData.scores) {
      console.debug(msgData.scores);
      this.setState({
        scores: msgData.scores
      });
    }
  }
}

export default App;
