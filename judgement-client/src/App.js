import React from 'react';
import './App.css';
import Hand from './components/hand'
import HiddenHand from './components/hiddenHand';

class App extends React.Component {
  state = {}
  componentDidMount() {
    console.log("componendDidMount");

    const ws = new WebSocket('ws://localhost:3001')
    ws.onopen = function onWebSocketConnectionOpen() {
      console.debug('Connection established!');
      ws.send('Hola from the client side');
    };
    ws.onmessage = function onWebSocketMessageReceived(msg) {
      console.debug('Message from server: ' + msg.data);
    }
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
        <div>
          <Hand name='Nikhil' cards={cards[0]}/>
          <Hand name='Abhisha' cards={cards[1]}/>
          <Hand name='Niraj' cards={cards[2]}/>
          <HiddenHand name='Mayuri' cardCount='5'/>
        </div>
      </div>
    );
  }
}

export default App;
