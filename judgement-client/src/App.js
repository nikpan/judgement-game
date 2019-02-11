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
      myCards: []
    };
    // this.setState((prevState, props) => {
    //   return {webSocket: null, name: 'Nikhil'}
    // });
    this.onSetNameClick = this.onSetNameClick.bind(this);
    this.onDealClick = this.onDealClick.bind(this);
  }

  getInitialState() {
    return this.state = {webSocket: null, name: 'Nikhil'};
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

    let cards = [
      [
        {suit: 'H', value: 'A'},
        {suit: 'D', value: '2'},
        {suit: 'S', value: '3'},
        {suit: 'S', value: 'J'},
        {suit: 'C', value: 'Q'}
      ],
      [
        {suit: 'H', value: '2'},
        {suit: 'D', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: '9'},
        {suit: 'C', value: 'J'}
      ],
      [
        {suit: 'H', value: '4'},
        {suit: 'D', value: '7'},
        {suit: 'S', value: '9'},
        {suit: 'S', value: '10'},
        {suit: 'C', value: 'Q'}
      ],
      [
        {suit: 'H', value: '7'},
        {suit: 'D', value: '3'},
        {suit: 'S', value: '3'},
        {suit: 'S', value: '6'},
        {suit: 'C', value: 'J'}
      ]
    ];
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
          {/* <Hand name='Nikhil' cards={cards[0]}/> */}
          {/* <Hand name='Abhisha' cards={cards[1]}/> */}
          {/* <Hand name='Niraj' cards={cards[2]}/> */}
          <HiddenHand name='Mayuri' cardCount='5'/>
        </div>
      </div>
    );
  }
}

export default App;
