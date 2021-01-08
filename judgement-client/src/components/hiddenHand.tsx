import React from 'react';
import Card, { ICard } from './card';
import './hand.css'
import SpecialCard, { SpecialCardType } from './specialCard';

export interface HiddenHandProps {
  cardCount: number;
  name: string;
  selectedCard: ICard | null;
  active: boolean;
}

export default class HiddenHand extends React.Component<HiddenHandProps> {
  selectedCard = () => {
    if (this.props.selectedCard) {
      return (
        <Card
          suit={this.props.selectedCard.suit}
          rank={this.props.selectedCard.rank}
        />
      )
    }
    else {
      return (
        <div style={{height:100, width:65, border:'1px black solid', borderRadius:5}}></div>
      );
    };
  }

  render() {
    const cardCount = this.props.cardCount;
    let cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(<SpecialCard key={i} type={SpecialCardType.BlueBack} />)
    }
    const nameStyles: React.CSSProperties = { 
      textAlign: 'center',
      textShadow: this.props.active ? 'white 1px 0 10px' : 'none'
    };
    return (
      <div className='otherPlayerContainer'>
        <h2 style={nameStyles}>{this.props.name}</h2>
        <div className='player'>
          <div className='playerHand hiddenHand'>
            <div className='handLeftBuffer'></div>
            <div style={{display:'flex'}}>{cards}</div>
            <div className='handRightBuffer'></div>
          </div><div className='playedCard'>
            <div className='handLeftBuffer'></div>
            {this.selectedCard()}
            <div className='handRightBuffer'></div>
          </div>
        </div>
      </div>
    )
  }
}