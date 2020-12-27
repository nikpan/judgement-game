import { PrimaryButton as Button, Label, Stack } from 'office-ui-fabric-react';
import React from 'react';
import { Utils } from '../utils/utils';

export interface WaitingPageProps {
  roomCode: string;
  playerList: string[];
  onStartGameClick: () => void;
}

export default class WaitingPage extends React.Component<WaitingPageProps> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    return <Stack gap={10} padding={10} maxWidth={300}>
      <Stack horizontal gap={10}>
        <Label>Room Code: {this.props.roomCode}</Label>
      </Stack>
      <Stack horizontal gap={10}>
        <Label>Players: {this.props.playerList.toString()}</Label>
      </Stack>
      <Stack horizontal gap={10}>
        <Button onClick={this.onStartGameClick}>Start Game</Button>
      </Stack>
    </Stack>;
  }

  onStartGameClick = () => {
    if(this.props.playerList && this.props.playerList.length < 2) {
      Utils.showErrorPopup(`Can't start game with just one player!`);
      return;
    }
    this.props.onStartGameClick();
  };
}
