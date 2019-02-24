import React from 'react';
import Card from './card';

export interface HiddenHandProps {
  cardCount: number;
  name: string;
}

export default class HiddenHand extends React.Component<HiddenHandProps> {
  render() {
    const cardCount = this.props.cardCount;
    let cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(<Card hidden={true} suit='' rank='' />)
    }
    return (
      <div>
        <h2>{this.props.name}'s Hand</h2>
        <div>
          {cards}
        </div>
      </div>
    )
  }
}