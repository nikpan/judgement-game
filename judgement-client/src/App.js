//@ts-check

import React from 'react';
import './App.css';
import Hand from './components/hand'
import HiddenHand from './components/hiddenHand';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webSocket: null,
      name: 'Nikhil',
      myCards: [],
      otherPlayers: []
    };
    this.onSetNameClick = this.onSetNameClick.bind(this);
    this.onDealClick = this.onDealClick.bind(this);
  }

  componentDidMount() {
  }

  openConnection() {
    const ws = new WebSocket('ws://localhost:3001');
    this.setState((prevState, props) => {
      return {webSocket: ws}
    });
    ws.onopen = () => {
      console.debug('Connection established!');
      var data = { 
        action: 'Join', 
        name: this.state.name 
      }; 
      ws.send(JSON.stringify(data));
    };
    ws.onmessage = (msg) => {
      var msgData = JSON.parse(msg.data);
      if(msgData.action === 'Hand') {
        var cardsFromServer = msgData.cards;
        this.setState({myCards: cardsFromServer});
      }
      if(msgData.action === 'AllPlayers') {
        let otherPlayerInfos = msgData.players;
        let toRemove = otherPlayerInfos.findIndex(player => player.name === this.state.name);
        otherPlayerInfos.splice(toRemove, 1);
        this.setState({otherPlayers: otherPlayerInfos});
      }
      console.debug('Message from server: ' + msg.data);
    };
  }

  closeConnection() {
    if(this.state.webSocket) {
      this.state.webSocket.close();
    }
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  onSetNameClick() {
    this.closeConnection();
    this.openConnection();
  }

  onDealClick() {
    var data = {
      action: 'Deal'
     };
    this.state.webSocket.send(JSON.stringify(data));
  }

  render() {
    let otherPlayers = [];
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
          <Hand name={this.state.name} cards={this.state.myCards}></Hand>
          {otherPlayers}
        </div>
      </div>
    );
  }
}

export default App;
