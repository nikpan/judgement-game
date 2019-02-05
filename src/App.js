import React from 'react';
import './App.css';
import Hand from './hand'

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>
          Judgement Game
        </h1>
        <div>
          <Hand>
          </Hand>
        </div>
      </div>
    );
  }
}

export default App;
