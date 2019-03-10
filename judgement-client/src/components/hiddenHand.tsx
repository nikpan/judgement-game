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
        hidden={false}
      />
    )
    return null;
  }

  render() {
    const cardCount = this.props.cardCount;
    let cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(<SpecialCard type={SpecialCardType.BlueBack}/>)
    }
    return (
      <div>
        <h2>{this.props.name}'s Hand</h2>
        <div className='player'>
          <div className='playerHand'>
            {cards}
          </div>
          <div className='playedCard'>
            {this.selectedCard()}
          </div>
        </div>
      </div>
    )
  }
}