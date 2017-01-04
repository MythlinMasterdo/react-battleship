import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: [],
    }
  }

  fire(e) {
    console.log('fire', e, 'board ', this.state.boardData);
    var boardLetter;
    var boardNumber = e.charAt(1);
    console.log('num', boardNumber);
    if(e.charAt(0) === "A") {
      boardLetter = 0;
    } else if(e.charAt(0) === "B") {
      boardLetter = 1;
    } else if(e.charAt(0) === "C") {
      boardLetter = 2;
    } else if(e.charAt(0) === "D") {
      boardLetter = 3;
    } else if(e.charAt(0) === "E") {
      boardLetter = 4;
    } else if(e.charAt(0) === "F") {
      boardLetter = 5;
    } else if(e.charAt(0) === "G") {
      boardLetter = 6;
    } else if(e.charAt(0) === "H") {
      boardLetter = 7;
    } else if(e.charAt(0) === "I") {
      boardLetter = 8;
    } else if(e.charAt(0) === "J") {
      boardLetter = 9;
    }
    console.log('letter ', boardLetter);
    console.log('location ', this.state.boardData[boardLetter][boardNumber]);
    axios.post('http://localhost:8080/fire', {
      boardPiece: e
    })
    .then(data => {
      this.setState({"boardData[boardLetter][boardNumber]": <span className={e} key={e} onClick={this.fire.bind(this, e)}>Hi!!!!!</span>})
    })
  }

  componentWillMount() {
    var count = 0;
    for(var i = 0; i < 10; i++) {
      var letters = ["A","B","C","D","E","F","G","H","I","J"];
      var row = [];
      for(var j = 1; j < 11; j++) {
      row.push(<span className={letters[count] + j} key={letters[count] + j} onClick={this.fire.bind(this, letters[count] + j)}>0</span>);
      }
      this.state.boardData.push(row);
      count++;
    }
    console.log(this.state.boardData);
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Battleship</h2>
        </div>
        <div className="board">
          <p> 1 2 3 4 5 6 7 8 9 10 </p>
          <p>A {this.state.boardData[0]}</p>
          <p>B {this.state.boardData[1]}</p>
          <p>C {this.state.boardData[2]}</p>
          <p>D {this.state.boardData[3]}</p>
          <p>E {this.state.boardData[4]}</p>
          <p>F {this.state.boardData[5]}</p>
          <p>G {this.state.boardData[6]}</p>
          <p>H {this.state.boardData[7]}</p>
          <p>I {this.state.boardData[8]}</p>
          <p>J {this.state.boardData[9]}</p>
        </div>
      </div>
    );
  }
}

export default App;
