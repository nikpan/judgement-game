import React from "react";
import './predictionSelector.css';


export interface PredictionSelectorProps {
  maxCount: number;
  onSetPrediction: (prediction: number) => void; 
}

export interface PredictionSelectorState {
  selectedItem: string;
}

export default class PredictionSelector extends React.Component<PredictionSelectorProps, PredictionSelectorState> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      selectedItem: "0"
    }
  }

  togglePills = (selectedItem: string) => (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (this.state.selectedItem !== selectedItem) {
      this.setState({
        selectedItem: selectedItem
      });
    }
  }
  
  onSetButtonClicked = () => {
    this.props.onSetPrediction(parseInt(this.state.selectedItem));
  };
  
  render = () => {
    return (
      <div className='jPredSelectorContainer'>
        <span style={{fontSize: 30}}>Set Prediction</span>
        <div className='jPredSelectorInner'>
          {this.renderSelectors()}
          <button style={{height:70}} className='jButton' onClick={this.onSetButtonClicked}>&nbsp;&nbsp;&nbsp;&nbsp;Set&nbsp;&nbsp;&nbsp;&nbsp;</button>
        </div>
      </div>
    );
  }

  renderSelectors(): React.ReactNode {
    let selectors = [];
    for (let i = 0; i <= this.props.maxCount; i++) {
      selectors.push(
        <PillButton 
          active={this.state.selectedItem===i.toString()} 
          text={i.toString()} 
          onClick={this.togglePills(i.toString())}>
        </PillButton>
      );
    }
    return selectors;
  }
  
}

interface PillButtonProps {
  active: boolean;
  text: string;
  onClick: (e: { preventDefault: () => void; }) => void;
}

class PillButton extends React.Component<PillButtonProps> {
  render = () => {
    let cssClass = this.props.active ? 'jActive' : '';
    cssClass += ' jPillButton jButton';
    return (
      <button 
        onClick={(e) => {
            this.props.onClick(e);
          }
        } 
        className={cssClass}>
          {this.props.text}
      </button>
    )
  }
}