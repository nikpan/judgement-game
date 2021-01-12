import React from 'react';
import './App.css';
import { ICard, Rank, Suit } from './components/card';
import { PlayerScore } from './components/scorecard';
import {
  Message,
  MessageType,
  ErrorMessage,
  PlayerHandMessage,
  PlayerInfo, 
  PlayerScoreMessage,
  ClientGameState,
  PlayerListMessage,
  PlayerInfoMessageV2,
  GameStateInfoMessage
} from './controllers/message';
import HomePage from './pages/HomePage';
import WaitingPage from './pages/WaitingPage';
import { Utils } from './utils/utils';
import PlayPage from './pages/PlayPage';
import ModalDialog from './components/modal';

export interface AppState {
  webSocket: WebSocket | null;
  name: string;
  cards: ICard[];
  otherPlayers: PlayerInfo[];
  selectedCard: ICard | null;
  prediction: number | null;
  currentSuit: Suit | null;
  trumpSuit: Suit;
  currentPlayerName: string | null;
  firstTurnPlayerName: string | null;
  currentGameState: ClientGameState;
  scores: PlayerScore[] | null;
  roomCode: string;
  playerList: string[];
  modalHidden: boolean;
  errorMessage: string;
}

class App extends React.Component<{}, AppState> {
  // private static readonly _wsConnectionUrl: string = 'ws://localhost:3001';
  private static readonly _wsConnectionUrl: string = 'wss://judgementgame-backend.azurewebsites.net'
  private _retryAttempts: number = 0;
  private _maxRetryAttempts: number = 5;
  private _isHost: boolean = false;
  private _isClosing: boolean = false;
  constructor(props: any) {
    super(props);
    this.state = {
      webSocket: null,
      name: '',
      cards: [],
      otherPlayers: [],
      selectedCard: null,
      prediction: null,
      currentSuit: null,
      trumpSuit: Suit.Spades,
      currentPlayerName: null,
      firstTurnPlayerName: null,
      currentGameState: ClientGameState.ChoosingName,
      scores: null,
      roomCode: '',
      playerList: [],
      modalHidden: true,
      errorMessage: ''
    };
  }

  componentDidMount() {
  }

  /** Home Page */
  closeConnection = () => {
    if (this.state.webSocket != null) {
      this.state.webSocket.close();
    }
  }

  onPredictionTextChange = (event: any) => {
    let val = event.target.value;
    let prediction: number | null = parseInt(val);
    console.log(prediction);
    prediction = isNaN(prediction) ? null : prediction; 
    this.setState( {prediction: prediction });
  }

  onCreateRoomClick = (name: string) => {
    this._isHost = true;
    this.setState({
      name: name
    })
    this.closeConnection();
    const createRoomMessage = {
      action: MessageType.CreateRoom,
      name: name
    };
    this.openConnectionAndSendMessage(createRoomMessage, false);
    this.setState({
      currentGameState: ClientGameState.Joining
    });
  }

  onJoinRoomClick = (name: string, roomCode: string) => {
    this._isHost = false;
    this.setState({
      name: name,
      roomCode: roomCode
    });
    this.closeConnection();
    const joinMessage = {
      action: MessageType.JoinRoom,
      name: name,
      roomCode: roomCode
    };
    this.openConnectionAndSendMessage(joinMessage, true);
    this.setState({
      currentGameState: ClientGameState.Joining
    });
  }

  openConnectionAndSendMessage = (message: Message, retry: boolean) => {
    const ws = new WebSocket(App._wsConnectionUrl);
    this.setState({ webSocket: ws });
    ws.onopen = () => {
      console.debug('Connection established!');
      (window as any)['jWebSocket'] = ws;
      this._retryAttempts = 0;
      this.hideModal();
      this.sendServerMessage(message);
      window.addEventListener('beforeunload', _ev => {
        this._isClosing = true;
        ws.close();
      });
    };
    ws.onmessage = (msg) => {
      var message = JSON.parse(msg.data);
      this.handleServerMessage(message as Message);
      console.log('Message from server:');
      console.debug(message);
    };
    ws.onerror = (msg) => {
    }
    ws.onclose = (msg) => {
      console.log(msg);
      console.log('onclose');
      if(this._isClosing) {
        return;
      }
      if(retry) {
        this.showModal(`OnClose:Connection to game server lost. Retrying: ${this._retryAttempts}...`);
        setTimeout(() => {
          this.retryConnection();
        }, 3000); 
      }
      else {
        this.showAutoDismissModal(`Can't connect to game server. Try again`);
      }
    }
    //TODO: add a connection timeout
  }

  retryConnection() {
    this._retryAttempts = this._retryAttempts + 1;
    if(this._retryAttempts >= this._maxRetryAttempts) {
      this.showModal(`Can't connect to game server. Giving up!`);
      this.setState({
        currentGameState: ClientGameState.ChoosingName
      });
      setTimeout(() => {
        this.hideModal();
        this._retryAttempts = 0;
      }, 5000);
      return;
    }
    const rejoinMessage = {
      action: MessageType.JoinRoom,
      name: this.state.name,
      roomCode: this.state.roomCode
    };
    this.openConnectionAndSendMessage(rejoinMessage, true);
  }

  /** Waiting Page */
  onStartGameClick = () => {
    this.sendServerMessage({
      action: MessageType.StartGame
    });
    this.setState({
      currentGameState: ClientGameState.Starting
    });
  };
  
  /** Playing Page*/
  onCardClick = (suit: Suit, rank: Rank) => {
    if (this.state.selectedCard != null) return;
    this.sendServerMessage({
      action: MessageType.PlayCard,
      card: {
        suit: suit,
        rank: rank
      }
    });
  }

  onSetPrediction = (prediction: number) => {
    this.setState({
      prediction: prediction
    });
    this.sendServerMessage({
      action: MessageType.SetJudgement,
      prediction: prediction
    });
  }

  render = () => {
    const currentState = this.state.currentGameState;
    const showHomePage = currentState === ClientGameState.ChoosingName || currentState === ClientGameState.Joining;
    const showWaitingPage = currentState === ClientGameState.WaitingToStartGame || currentState === ClientGameState.Starting;
    const showPlayPage = currentState === ClientGameState.PredictionPhase || currentState === ClientGameState.PlayPhase || currentState === ClientGameState.CalculatingWinner;
    const predictionEditable = currentState === ClientGameState.PredictionPhase && this.state.currentPlayerName === this.state.name;

    return (
      <div>
        {/* Home Page */}
        {showHomePage ? this.renderHomePage() : <></>}
        {/* Waiting Page */}
        {showWaitingPage ? this.renderWaitingPage() : <></>}
        {/* Playing Page */}
        {showPlayPage ? this.renderPlayPage(predictionEditable) : <></>}
        <ModalDialog hidden={this.state.modalHidden} message={this.state.errorMessage}></ModalDialog>
      </div>
    );
  }

  private renderPlayPage(predictionEditable: boolean) {
    return (
      <PlayPage 
        {...this.state}
        onCardClick={this.onCardClick} 
        onSetPrediction={this.onSetPrediction} 
        predictionEditable={predictionEditable} 
      />
    );
  }

  private renderWaitingPage() {
    return (
      <WaitingPage 
        {...this.state}
        showStartGame={this._isHost}
        onStartGameClick={this.onStartGameClick}
        showErrorPopup={this.showAutoDismissModal}
      />
    );
  }

  private renderHomePage() {
    return (
      <HomePage 
        onCreateRoomClick={this.onCreateRoomClick} 
        onJoinRoomClick={this.onJoinRoomClick}
        showErrorPopup={this.showAutoDismissModal}
      />
    );
  }

  /** Common functions */
  private sendServerMessage(message: any) {
    if (this.state.webSocket == null) {
      this.showModal(`Error: Can't send message because websocket is null`);
      return;
    }
    console.log('Sending Message');
    console.debug(message);
    this.state.webSocket.send(JSON.stringify(message));
  }

  showAutoDismissModal = (message: string) => {
    this.showModal(message);
    setTimeout(() => {
      this.hideModal();
    }, 3000);
  }

  private showModal(message: string) {
    this.setState({
      modalHidden: false,
      errorMessage: message
    });
  }

  private hideModal() {
    this.setState({
      modalHidden: true
    });
  }

  private handleServerMessage(msgData: Message) {
    if (msgData.action === MessageType.PlayerList) {
      msgData = msgData as PlayerListMessage;
      this.handlePlayerListMessage(msgData);
    }
    else if (msgData.action === MessageType.Hand) {
      msgData = msgData as PlayerHandMessage;
      this.handlePlayerHandMessage(msgData);
    }
    else if (msgData.action === MessageType.PlayerInfo) {
      msgData = msgData as PlayerInfoMessageV2;
      this.handlePlayerInfoMessageV2(msgData);
    }
    else if (msgData.action === MessageType.GameStateInfo) {
      msgData = msgData as GameStateInfoMessage;
      this.handleGameStateInfoMessage(msgData);
    }
    else if (msgData.action === MessageType.Error) {
      msgData = msgData as ErrorMessage;
      this.handleErrorMessage(msgData);
    }
    else if (msgData.action === MessageType.AllScores) {
      msgData = msgData as PlayerScoreMessage;
      this.handleAllScoresMessage(msgData);
    }
    else {
      console.log('Unidentified Message');
      console.debug(msgData);
    }

  }
  
  private handleAllScoresMessage(message: PlayerScoreMessage) {
    this.setState({
      scores: message.scores
    });
  }

  private handleErrorMessage(message: ErrorMessage) {
    this.showAutoDismissModal(`Error: ${message.code}`);
  }

  private handlePlayerListMessage(message: PlayerListMessage) {
    console.debug(message.playerList);
    this.setState({
      roomCode: message.roomCode,
      playerList: message.playerList,
      currentGameState: ClientGameState.WaitingToStartGame
    });
  }

  private handlePlayerInfoMessageV2(message: PlayerInfoMessageV2) {
    let otherPlayerInfos = message.players;
    let myInfo;
    while(true) {
      myInfo = otherPlayerInfos.shift();
      if(myInfo!.name === this.state.name) {
        break;
      }
      otherPlayerInfos.push(myInfo!);
    }

    this.setState({
      otherPlayers: otherPlayerInfos,
      selectedCard: myInfo!.selectedCard,
    });
  }

  private handleGameStateInfoMessage(message: GameStateInfoMessage) {
    if(this.state.currentGameState !== message.gameState && message.gameState === ClientGameState.PredictionPhase) {
      this.setState({
        prediction: null
      })
    }
    this.setState({
      trumpSuit: message.trumpSuit!,
      currentSuit: message.currentSuit!,
      currentPlayerName: message.currentPlayerName!,
      firstTurnPlayerName: message.firstTurnPlayerName!,
      currentGameState: message.gameState
    });
  }

  private handlePlayerHandMessage(message: PlayerHandMessage) {
    var cardsFromServer = message.cards;
    this.setState({ cards: cardsFromServer });
  }
}

export default App;
