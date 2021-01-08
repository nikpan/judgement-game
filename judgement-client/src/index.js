import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import TableTest from './test/TableTest';
import HomePageTest from './test/HomePageTest';
import WaitingPageTest from './test/WaitingPageTest';
import PlayPageTest from './test/PlayPageTest';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

