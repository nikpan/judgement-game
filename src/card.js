import React from 'react';
import AC from '../public/resources/img/AC.png';

export default class Card extends React.Component {
    constructor() {
        super();
    }

    render() {
        if( this.validateProps() ){
            return (
                <div>{this.renderCard()}</div>
            )
        }
        else {
            return (
                <div>Invalid Card</div>
            )
        }
    }

    validateProps(){
        let ret=true;
        switch (this.props.suit) {
            case "H":
            case "S":
            case "D":
            case "C":
                ret = ret && true;
                break;
            default:
                ret = ret && false;
                break;
        }
        switch (this.props.value) {
            case "A":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "J":
            case "Q":
            case "K":
                ret = ret && true;
                break;
            default:
                ret = ret && false;
                break;
        }
        return ret;
    }

    renderCard(){
        // const imgName = "/public/resources/" + this.props.value + this.props.suit + ".png";
        return (
            <img src={AC} alt="cardImage" />
        )
    }
}