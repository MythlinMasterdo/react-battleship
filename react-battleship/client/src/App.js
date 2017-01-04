import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SimpleTable} from 'react-simple-table';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: []
    }
  }

  componentWillMount() {
    var count = 0;
    for(var i = 0; i < 10; i++) {
      console.log('ran');
      var letters = ["A","B","C","D","E","F","G","H","I","J"];
      for(var j = 1; j < 11; j++) {
      this.state.boardData.push(<p className={letters[count] + j} key={letters[count] + j}>O</p>);
      }
      count++;
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Battleship</h2>
        </div>
        <div className="board">
          {this.state.boardData.map((boardPiece) => {
            return boardPiece
          })}
        </div>
      </div>
    );
  }
}

export default App;
