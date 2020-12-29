import React from 'react';
import HomePage from '../pages/HomePage';

export default class HomePageTest extends React.Component<{},{}> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    return (
      <HomePage 
        onCreateRoomClick={this.dummyMethod} 
        onJoinRoomClick={this.dummyMethod} 
        showErrorPopup={this.dummyMethod} 
      />
    );
  }

  dummyMethod = () => {
    console.log('dummyMethod called');
    setTimeout(() => {
    }, 3000);
  }
}