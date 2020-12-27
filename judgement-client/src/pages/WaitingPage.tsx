import { PrimaryButton as Button, Label, Stack, TextField } from 'office-ui-fabric-react';
import React from 'react';
import getImageSrc from '../components/imgLoader';
import { Utils } from '../utils/utils';

export interface WaitingPageProps {
  name: string;
  roomCode: string;
  playerList: string[];
  onStartGameClick: () => void;
}

export default class WaitingPage extends React.Component<WaitingPageProps> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    return (
      <>
        <div className='jHomeHeader'>
          <span style={{ fontSize: '50px', fontWeight: 'bold' }}>THE</span>
          <br />
          <span style={{ fontSize: '75px', fontWeight: 'bold' }}>JUDGEMENT</span>
          <br />
          <span style={{ fontSize: '50px', fontWeight: 'bold' }}>GAME</span>
          <br />
          <img
            src={getImageSrc('AS')}
            className="cardImg"
            alt="cardImage"
            style={{
              height: '75%',
              width: '70%',
              position: 'relative',
              left: 200,
              top: -50,
              overflow: 'hidden'
            }}
          />
        </div>
        <div className='jHomeContainer'>
          <div className='jRowItem'>
            <TextField contentEditable={'false'} value={this.props.name} className='jTextField' />
          </div>
          <div className='jRowItem'>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, paddingRight: 10 }}>
                <TextField contentEditable={'false'} value={`Code: ${this.props.roomCode}`} className='jTextField' />
              </div>
              <div style={{ flexGrow: 1 }}>
                <button className='jButton'>Share</button>
              </div>
            </div>
          </div>
          <div className='jRowItem'>
            <div>
              <button onClick={this.onStartGameClick} className='jButton'>Start Game</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  onStartGameClick = () => {
    if(this.props.playerList && this.props.playerList.length < 2) {
      Utils.showErrorPopup(`Can't start game with just one player!`);
      return;
    }
    this.props.onStartGameClick();
  };
}
