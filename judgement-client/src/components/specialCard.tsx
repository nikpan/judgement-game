import * as React from 'react';
import './card.css';
import getImageSrc from './imgLoader';

export enum SpecialCardType {
  ClubsSuit = 'ClubsSuit',
  SpadesSuit = 'SpadesSuit',
  DiamondsSuit = 'DiamondsSuit',
  HeartsSuit = 'HeartsSuit',
  BlueBack = 'BlueBack'
}

export interface SpecialCardProps {
  type: SpecialCardType
}

export default class SpecialCard extends React.Component<SpecialCardProps> {
  render() {
    return (
      <div className="cardDiv">
        <img src={getImageSrc(this.props.type)} className='cardImg' alt='card back' /></div>
    )
  }
}