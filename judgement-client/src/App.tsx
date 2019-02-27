import React from 'react';
import './App.css';
import Hand from './components/hand'
import HiddenHand from './components/hiddenHand';
import { CardProps } from './components/card';

export interface AppState {
  webSocket: WebSocket | null;
  name: string;
  myCards: CardProps[];
  otherPlayers: PlayerInfo[];
}

enum MessageType {
  Deal = 'Deal',
  Join = 'Join',
  Hand = 'Hand',
  AllPlayers = 'AllPlayers'
}

interface PlayerInfo {
  name: string;
  cardCount: number;
}

interface ServerMessage {
  action: MessageType;
  cards?: CardProps[];
  players?: PlayerInfo[];
}

class App extends React.Component<{},AppState> {
  initialState = {
    webSocket: null,
    name: 'Nikhil',
    myCards: [],
    otherPlayers: []
  };

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
        otherPlayerInfos.splice(toRemove, 1);
        this.setState({ otherPlayers: otherPlayerInfos });
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
    console.log(suit + rank);
  }

  render() {
    let otherPlayers:any[] = [];
    this.state.otherPlayers.forEach(player => {
      otherPlayers.push(<HiddenHand name={player.name} cardCount={player.cardCount}></HiddenHand>)
    });
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
            cardSelected={this.onCardClick}
          />
          {otherPlayers}
        </div>
      </div>
    );
  }
}

export default App;
