import React from 'react';
import Card from './card';

export default class Hand extends React.Component {
    render(){
        return (
            <div>
                <h2>Hand</h2>
                <div>
                    <Card suit="H" value="A" />
                </div>
            </div>
        )
    }
}