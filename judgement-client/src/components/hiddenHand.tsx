import React from 'react';
import Card, { ICard } from './card';
import './hand.css'
import SpecialCard, { SpecialCardType } from './specialCard';

export interface HiddenHandProps {
  cardCount: number;
  name: string;
  selectedCard: ICard | null;
}

export default class HiddenHand extends React.Component<HiddenHandProps> {
  selectedCard = () => {
    if (this.props.selectedCard) return (
      <Card 
        suit={this.props.selectedCard.suit} 
        rank={this.props.selectedCard.rank} 
      />
    )
    return null;
  }

  render() {
    const cardCount = this.props.cardCount;
    let cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(<SpecialCard key={i} type={SpecialCardType.BlueBack}/>)
    }
    return (
      <div className='otherPlayerContainer'>
        <h2 style={{textAlign:'center'}}>{this.props.name}</h2>
        <div className='player'>
          <div style={{display:'flex', flexFlow:'row'}}>
          <div className='handLeftBuffer'></div>
          <div className='playedCard'>
            {this.selectedCard()}
          </div>
          <div className='handRightBuffer'></div>
          </div>
        </div>
      </div>
    )
  }
}