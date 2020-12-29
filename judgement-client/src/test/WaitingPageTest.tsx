import React from 'react';
import WaitingPage from '../pages/WaitingPage';

export default class WaitingPageTest extends React.Component<{},{}> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    const name = 'Gabbar';
    const roomCode = '12345';
    const playerList = ['Jai', 'Viru', 'Gabbar', 'Basanti']
    return (
      <WaitingPage 
        name={name} 
        roomCode={roomCode} 
        playerList={playerList} 
        onStartGameClick={this.dummyMethod} 
        showErrorPopup={this.dummyMethod}
      />
    );
  }

  dummyMethod = () => {

  }
}