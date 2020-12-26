import { PrimaryButton as Button, ITextField, Label, Stack, TextField } from "office-ui-fabric-react";
import React from "react";
import { Utils } from "../components/utils/utils";

export interface HomePageProps {
  onCreateRoomClick: (name:string) => void;
  onJoinRoomClick: (name:string, roomCode:string) => void;

}

export default class HomePage extends React.Component<HomePageProps> {
  private _nameText: React.RefObject<ITextField> = React.createRef<ITextField>();
  private _roomCodeText: React.RefObject<ITextField> = React.createRef<ITextField>();
  
  constructor(props: HomePageProps | Readonly<HomePageProps>) {
    super(props);
  }

  render = () => {
    return (
      <Stack gap={10} padding={10} maxWidth={300}>
      <Stack.Item align='stretch'>
        <Stack horizontal grow gap={10}>
          <Label>Name</Label>
          <TextField componentRef={this._nameText} placeholder='Your Name' />
        </Stack>
      </Stack.Item>
      <Stack.Item align='stretch'>
        <Stack>
          <Button onClick={this.onCreateRoomClick}>Create Room</Button>
        </Stack>
      </Stack.Item>
      <Stack.Item align='stretch'>
        <Stack horizontal gap={10}>
          <TextField componentRef={this._roomCodeText} placeholder='Room Code' />
          <Button onClick={this.onJoinRoomClick}>Join Room</Button>
        </Stack>
      </Stack.Item>
    </Stack>
    );
  }

  onCreateRoomClick = () => {
    if(this._nameText.current === null || Utils.IsNullOrUndefined(this._nameText.current.value)) {
      this.showErrorPopup(`Can't create room! Name empty`);
      return;
    }

    const name = this._nameText.current.value!;
    this.props.onCreateRoomClick(name);
  };

  onJoinRoomClick = () => {
    if(this._roomCodeText.current === null || Utils.IsNullOrUndefined(this._roomCodeText.current.value)) {
      this.showErrorPopup(`Can't join room! Room code empty`);
      return;
    }
    if(this._nameText.current === null || Utils.IsNullOrUndefined(this._nameText.current.value)) {
      this.showErrorPopup(`Can't join room! Name empty`);
      return;
    }

    const name = this._nameText.current.value!;
    const roomCode = this._roomCodeText.current.value!;

    this.props.onJoinRoomClick(name, roomCode);
  }

  showErrorPopup= (errMessage: string) => {
    alert(errMessage);
  }
}