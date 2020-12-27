import { PrimaryButton as Button, ITextField, Label, Stack, TextField, StackItem, FontWeights } from "office-ui-fabric-react";
import React from "react";
import './HomePage.css';
import { Utils } from "../utils/utils";
import getImageSrc from "../components/imgLoader";

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
      <>
      <div className='jHomeHeader'>
        <span style={{fontSize:'50px', fontWeight:'bold'}}>THE</span>
        <br />
        <span style={{fontSize:'75px', fontWeight:'bold'}}>JUDGEMENT</span>
        <br/> 
        <span style={{fontSize:'50px', fontWeight:'bold'}}>GAME</span>
        <br/>
        <img 
            src={getImageSrc('AS')} 
            className="cardImg" 
            alt="cardImage"
            style={{
              height:'75%',
              width:'70%',
              position:'relative',
              left:200,
              top:-50,
              overflow:'hidden'
            }} 
          />
      </div>
      {/* <Stack gap={10} padding={20} className='jHomeContainer'>
        <Stack.Item align='stretch' className='jRowItem'>
            <TextField componentRef={this._nameText} placeholder='Your Name' className='jTextField' />
        </Stack.Item>
        <Stack.Item align='stretch' className='jRowItem'>
          <Stack>
            <Button onClick={this.onCreateRoomClick} className='jButton'>Create Room</Button>
          </Stack>
        </Stack.Item>
        <Stack.Item align='stretch' className='jRowItem'>
          <Stack horizontal gap={10} grow >
            <Stack.Item grow='inherit'>
              <TextField componentRef={this._roomCodeText} placeholder='Room Code' className='jTextField' />
            </Stack.Item>
            <Stack.Item grow='inherit' align='stretch'>
              <Button onClick={this.onJoinRoomClick} className='jButton'>Join Room</Button>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack> */}
      <div className='jHomeContainer'>
        <div className='jRowItem'>
            <TextField componentRef={this._nameText} placeholder='Your Name' className='jTextField' />
        </div>
        <div className='jRowItem'>
          <div>
            <button onClick={this.onCreateRoomClick} className='jButton'>Create Room</button>
          </div>
        </div>
        <div className='jRowItem'>
          <div style={{display:'flex'}}>
            <div style={{flexGrow:1, paddingRight: 10}}>
              <TextField componentRef={this._roomCodeText} placeholder='Room Code' className='jTextField' />
            </div>
            <div style={{flexGrow:1}}>
              <button onClick={this.onJoinRoomClick} className='jButton'>Join Room</button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  onCreateRoomClick = () => {
    if(this._nameText.current === null || Utils.IsNullOrUndefined(this._nameText.current.value)) {
      Utils.showErrorPopup(`Can't create room! Name empty`);
      return;
    }

    const name = this._nameText.current.value!;
    this.props.onCreateRoomClick(name);
  };

  onJoinRoomClick = () => {
    if(this._roomCodeText.current === null || Utils.IsNullOrUndefined(this._roomCodeText.current.value)) {
      Utils.showErrorPopup(`Can't join room! Room code empty`);
      return;
    }
    if(this._nameText.current === null || Utils.IsNullOrUndefined(this._nameText.current.value)) {
      Utils.showErrorPopup(`Can't join room! Name empty`);
      return;
    }

    const name = this._nameText.current.value!;
    const roomCode = this._roomCodeText.current.value!;

    this.props.onJoinRoomClick(name, roomCode);
  }
}