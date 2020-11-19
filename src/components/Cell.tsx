/**
 * MIT License
 *
 * Copyright (c) 2020, Concordant and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react';

/**
 * Interface for the properties of the Cell
 */
interface ICellProps {
    index: number,
    value: string,
    onChange: any
    lock: boolean
}

/**
 * Interface for the state of the Cell
 */
interface ICellState {
  value: string,
  regexp: RegExp
}

/**
 * This class represent a cell of the Sudoku
 */
class Cell extends React.Component<ICellProps,ICellState> {
  constructor(props: ICellProps) {
    super(props);
    this.state = {
      value: props.value,
      regexp:/^[1-9\b]$/
    };
  }
  
  onChange(event: any){
    if (this.props.lock){
      //console.log("lock")
    } else if (event.target.value === "" || this.state.regexp.test(event.target.value)){
      this.setState({value: event.target.value})
      this.props.onChange(this.props.index, event.target.value)
    } else {
      //console.log("Invalid input : " + this.props.index + " = " + event.target.value)
      event.target.value=this.state.value
    }
  }
  
  render() {
    let myClass="cell"
    if (this.state.value.length>1){
      myClass+=" mv"
    }
    if (this.props.lock){
      myClass+= " lock"
    }
    return (
      <textarea
        id={String(this.props.index)}
        className={myClass}
        maxLength={1}
        rows={3}
        cols={6}
        value={this.state.value}
        onChange={(event) => this.onChange(event)}
      />
    );
  }
}

export default Cell
