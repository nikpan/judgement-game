import React from 'react';
import './App.css';
import Hand from './components/hand'
import HiddenHand from './components/hiddenHand';
import { CardProps, ICard } from './components/card';

export interface AppState {
  webSocket: WebSocket | null;
  name: string;
  myCards: ICard[];
  otherPlayers: PlayerInfo[];
  selectedCard: ICard | null;
}

enum MessageType {
  Deal = 'Deal',
  Join = 'Join',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers',
  PlayCard = 'PlayCard'
}

interface PlayerInfo {
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
}

class App extends React.Component<{},AppState> {
  constructor(props:any) {
    super(props);
    this.state = {
      webSocket: null,
      name: 'Nikhil',
      myCards: [],
      otherPlayers: [],
      selectedCard: null
    };
  }

  componentDidMount() {
  }

  openConnection = () => {
    const ws = new WebSocket('ws://localhost:3001');
    this.setState({webSocket: ws});
    ws.onopen = () => {
      console.debug('Connection established!');
      var data = {
        action: 'Join',
        name: this.state.name
      };
      ws.send(JSON.stringify(data));
    };
    ws.onmessage = (msg) => {
      var msgData: ServerMessage = JSON.parse(msg.data);
      if (msgData.action === 'Hand' && msgData.cards) {
        var cardsFromServer = msgData.cards;
        this.setState({ myCards: cardsFromServer });
      }
      if (msgData.action === 'AllPlayers' && msgData.players) {
        let otherPlayerInfos = msgData.players;
        let toRemove = otherPlayerInfos.findIndex((player: { name: string; }) => player.name === this.state.name);
        let myInfo = otherPlayerInfos.splice(toRemove, 1)[0];
        this.setState({ otherPlayers: otherPlayerInfos, selectedCard: myInfo.selectedCard});
      }
      console.debug('Message from server: ' + msg.data);
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
      action: 'Deal'
    };
    if (this.state.webSocket != null) {
      this.state.webSocket.send(JSON.stringify(data));
    }
  }

  onCardClick = (suit: string, rank: string) => {
    if(this.state.selectedCard != null) return;
    if(this.state.webSocket != null) {
      this.state.webSocket.send(JSON.stringify({
        action: 'PlayCard',
        card: {
          suit: suit, 
          rank: rank
        }
      }))
    }
    this.setState({
      selectedCard: {
        suit: suit, 
        rank: rank,
      }
    });
    console.log(suit + rank);
  }

  renderOtherPlayers = () => {
    if(this.state.otherPlayers) {
      let otherPlayers = new Array();
      this.state.otherPlayers.forEach(player => {
        otherPlayers.push(<HiddenHand selectedCard={player.selectedCard} name={player.name} cardCount={player.cardCount} />)
      })
      return otherPlayers;
    }
    return null;
  }

  render = () => {
    return (
      <div>
        <h1>
          Judgement Game
        </h1>
        <label>
          Name:
          <input type='text' value={this.state.name} onChange={(event) => this.handleChange(event)}></input>
        </label>
        <button onClick={this.onSetNameClick}>Submit</button>
        <button onClick={this.onDealClick}>Deal!</button>
        <div>
          <Hand 
            name={this.state.name}
            cards={this.state.myCards}
            selectedCard={this.state.selectedCard} 
            cardSelected={this.onCardClick}
          />
          {this.renderOtherPlayers()}
        </div>
      </div>
    );
  }
}

export default App;
