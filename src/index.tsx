import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Method } from '@testing-library/react';
import { crdtlib as crdtl } from 'c-crdtlib';

let env = new crdtl.utils.SimpleEnvironment(
  new crdtl.utils.ClientUId("myClientId"));

interface ISquareProps {
  index: number,
  value: string,
  onChange: any
}

interface ISquareState {
  value: string,
  regexp: RegExp
}

class Square extends React.Component<ISquareProps,ISquareState> {
  constructor(props: ISquareProps) {
    super(props);
    this.state = {
      value: props.value,
      regexp:/^[1-9\b]$/
    };
  }
  
  onChange(event: any){
    if (event.target.value == "" || this.state.regexp.test(event.target.value)){
      this.setState({value: event.target.value})
      this.props.onChange(this.props.index, event.target.value)
    } else {
      console.log("Invalid input : " + this.props.index + " = " + event.target.value)
      event.target.value=this.state.value
    }
  }
  
  render() {
    return (
      <input
        className="square"
        type="text"
        maxLength={1}
        size={1}
        value={this.state.value}
        onChange={(event) => this.onChange(event)}
      />
    );
  }
}

interface IGridState {
  squares: any
}

class Grid extends React.Component<{},IGridState> {
  constructor(props: any) {
    super(props);
    
    const array = ["","","","","","","","","",
                   "","1","9","4","5","2","3","6","8",
                   "3","4","","","9","6","2","5","7",
                   "","","1","9","","5","4","7","",
                   "","9","6","","7","4","8","","1",
                   "4","7","3","","6","1","","","9",
                   "1","","","","","9","","","3",
                   "","","4","","1","","7","","5",
                   "","6","5","7","4","3","1","8","2"]

    // const array = Array(9*9)
    // for (let i in init){
    //   array[i]=new crdtl.crdt.MVRegister()
    //   array[i].set(init[i], env.tick())
    // }

    this.state = {
      squares: array
    };
  }

  handleChange(index:number , value:string) {
    const squares = this.state.squares.slice();
    console.log(index + " : change from " + squares[index] + " to "+ value)
    squares[index]=value;
    this.setState({
      squares: squares,
    });
  }

  renderSquare(i: number) {
    return (
      <Square
        index={i}
        value={this.state.squares[i]}
        onChange={(index:number, value:string) => this.handleChange(index, value)}
      />
    );
  }
  
  renderLine(i:number){
    return (
      <div className="grid-row">
        {this.renderSquare(i*9+0)}{this.renderSquare(i*9+1)}{this.renderSquare(i*9+2)}
        {this.renderSquare(i*9+3)}{this.renderSquare(i*9+4)}{this.renderSquare(i*9+5)}
        {this.renderSquare(i*9+6)}{this.renderSquare(i*9+7)}{this.renderSquare(i*9+8)}
      </div>
    )
  }

  render() {
    const winner = validateSudoku(this.state.squares);
    let status;
    status = "Status : " + winner;

    return (
      <div>
        <div className="status">{status}</div>
        {this.renderLine(0)}
        {this.renderLine(1)}
        {this.renderLine(2)}
        {this.renderLine(3)}
        {this.renderLine(4)}
        {this.renderLine(5)}
        {this.renderLine(6)}
        {this.renderLine(7)}
        {this.renderLine(8)}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-grid">
          <Grid />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function checkArray(array:any){
  for (let i=0;i<array.length;i++){
    if (array[i]>1){
      return false
    }
  }
  return true
}

function checkLine(line:number,squares:any){
  var check=Array(9).fill(0)
  for (let col=0; col<9; col++){
    var index=line*9+col
    if (squares[index]==""){
      continue
    }
    check[squares[index]]++
  }
  return checkArray(check)
}

function checkColumn(col:number,squares:any){
  var check=Array(9).fill(0)
  for (let line=0; line<9; line++){
    var index=line*9+col
    if (squares[index]==""){
      continue
    }
    check[squares[index]]++
  }
  return checkArray(check)
}

function firstSquareOfBlock(block:number){
  var line=Math.floor(block/3)*3
  var column=(block%3)*3
  return [line,column]
}

function checkBlock(block:number, squares:any){
  var check=Array(9).fill(0)
  var blocklc=firstSquareOfBlock(block)
  var line=blocklc[0]
  var col=blocklc[1]
  //console.log(line,col)
  var index=[ line   *9 + col,   line   *9 + col+1,  line   *9 + col+2,
         (line+1)*9 + col,  (line+1)*9 + col+1, (line+1)*9 + col+2,
         (line+2)*9 + col,  (line+2)*9 + col+1, (line+2)*9 + col+2]
  //console.log(index)
  for (var i of index){
    if (squares[i]==""){
      continue
    }
    check[squares[i]]++
  }
  //console.log(check)
  return checkArray(check)
}

function validateSudoku(squares:any) {
  var error=""
  for (let line=0; line<9; line++){
    if (checkLine(line,squares)==false){
      error+="Erreur ligne "+ (line+1).toString()
    }
  }
  for (let col=0; col<9; col++){
    if (checkColumn(col,squares)==false){
      error+= "Erreur colonne "+ (col+1).toString()
    }
  }
  for (let block=0; block<9; block++){
    if (checkBlock(block, squares)==false){
      error+= "Erreur block "+ (block+1).toString()
    }
  }
  
  if (error){
    return error
  }
  
  if (squares.some((x:any) => x=="")){
    return "Continue"
  }
  return "Complete"
}
