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
        <div style={{height:250, width:165, border:'1px black solid', borderRadius:5}}></div>
      );
    };
  }

  render() {
    const cardCount = this.props.cardCount;
    let cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(<SpecialCard key={i} type={SpecialCardType.BlueBack} />)
    }
    let nameStyles = 'playerName';
    nameStyles += this.props.active ? ' currentPlayer' : '';
    return (
      <div className='otherPlayerContainer'>
        <div style={{display:'flex'}}>
          <div className='handLeftBuffer'></div>
          <div><span className={nameStyles}>{this.props.name}</span></div>
          <div className='handRightBuffer'></div>
        </div>
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