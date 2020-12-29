import React from 'react';

export interface ModalProps {
  message: string;
  hidden: boolean;
}

export default class ModalDialog extends React.Component<ModalProps,{}> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    const modalContainerStyle:React.CSSProperties = {
      display:'flex',
      zIndex:2,
      backgroundColor: 'rgba(128,128,128,0.4)',
      position:'absolute',
      height:'100%',
      width:'100%',
      left:0,
      top:0,
      visibility: this.props.hidden ? 'hidden' : 'visible'
    };
    const modalStyle: React.CSSProperties = {
      flexGrow:0, 
      padding:50, 
      border:'1px solid black', 
      backgroundColor:'white',
      fontFamily: 'Segoe UI',
      fontSize: 30
    };
    return (
      <div style={modalContainerStyle}>
        <div style={{flexGrow:1}}></div>
        <div style={{flexGrow:0, display:'flex', opacity:1, flexFlow:'column'}}>
          <div style={{flexGrow:1}}></div>
          <div style={modalStyle}>{this.props.message}</div>
          <div style={{flexGrow:1}}></div>
        </div>
        <div style={{flexGrow:1}}></div>
      </div>
    )
  }
}