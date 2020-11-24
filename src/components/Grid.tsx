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
import assert from 'assert';
import Cell from './Cell';
import { crdtlib } from '@concordant/c-crdtlib';

let env = new crdtlib.utils.SimpleEnvironment(
    new crdtlib.utils.ClientUId("myClientId"));

/**
 * Interface for the properties of the Grid
 */
interface IGridProps {
  initial: String[]
}

/**
 * Interface for the state of the Grid
 */
interface IGridState {
  cells: any
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps, IGridState> {
  constructor(props: any) {
    super(props);
    assert.ok(this.props.initial.every(x => (x==="" || Number(x)>=1)))
    assert.ok(this.props.initial.every(x => Number(x)<=9))

    let mvArray : any[] = Array(9*9)
    for (let i=0; i<9*9; i++) {
      mvArray[i] = new crdtlib.crdt.MVRegister()
      if (props.initial[i]!=="") {
        mvArray[i].set(props.initial[i], env.tick())
      }
    }

    // TEST MV
    // let envs = Array(9)
    // let newvals = Array(9)
    // for (let i = 0; i<9; i++) {
    //     envs[i] = new crdtlib.utils.SimpleEnvironment(
    //         new crdtlib.utils.ClientUId("myClientId"+i));
    //     newvals[i] = new crdtlib.crdt.MVRegister()
    //     newvals[i].set(String(i+1), envs[i].tick())
    //     mvArray[72].merge(newvals[i])
    // }
    // END TEST MV

    this.state = {
      cells: mvArray,
    };
  }

  /**
   * This handler is called when the value of a cell is changed.
   * @param index The index of the cell changed.
   * @param value The new value of the cell.
   */
  handleChange(index:number , value:string) {
    assert.ok(value === "" || Number(value) >= 1)
    assert.ok(Number(value) <= 9)
    assert.ok(index >= 0)
    assert.ok(index < 9*9)
    const cells = this.state.cells.slice();
    console.log(index + " : change from " + this.getValue(index) + " to "+ value)
    cells[index].set(value, env.tick());
    this.setState({
      cells: cells,
    });
  }

  /**
   * This function return a React element corresponding to a cell.
   * @param index The index of the cell to render.
   */
  renderCell(index: number) {
    assert.ok(index >= 0)
    assert.ok(index < 9*9)
    let val = this.getValue(index)
    let toLock
    if (this.props.initial[index]) {
      toLock = true 
    } else {
      toLock = false
    }
    return (
      <Cell
        index={index}
        value={val}
        onChange={(index:number, value:string) => this.handleChange(index, value)}
        lock={toLock}
      />
    );
  }
  
  /**
   * This function return a React element corresponding to a block of cell.
   * @param blockNum The index of the block to render.
   */
  renderBlock(blockNum: number) {
    assert.ok(blockNum >= 0)
    assert.ok(blockNum < 9)
    let index = blockIndex(blockNum)
    return (
      <td>
        {this.renderCell(index[0])}{this.renderCell(index[1])}{this.renderCell(index[2])}<br />
        {this.renderCell(index[3])}{this.renderCell(index[4])}{this.renderCell(index[5])}<br />
        {this.renderCell(index[6])}{this.renderCell(index[7])}{this.renderCell(index[8])}
      </td>
    )
  }

  /**
   * The function is called when the grid is updated. It return a React element corresponding to the grid of the Sudoku.
   */
  render() {
    const status = "Status : " + this.validateSudoku();

    return (
      <div className="sudokuTable">
        <table>
          <tbody>
            <tr>
              {this.renderBlock(0)}
              {this.renderBlock(1)}
              {this.renderBlock(2)}      
            </tr>
            <tr>
              {this.renderBlock(3)}
              {this.renderBlock(4)}
              {this.renderBlock(5)}      
            </tr>
            <tr>
              {this.renderBlock(6)}
              {this.renderBlock(7)}
              {this.renderBlock(8)}      
            </tr>
          </tbody>
        </table>
        <div className="status" id="status">{status}</div>
      </div>
    );
  }

  /**
   * Return the element at the given index from the cells.
   * @param index The index of the cell. The value of the cell at ‘index’ is returned.
   */
  getValue(index: number) {
    assert.ok(index >= 0)
    assert.ok(index < 9*9)
    const cells = this.state.cells.slice();
    let value = new Set()

    let it = cells[index].get().iterator()
    while (it.hasNext()) {
      value.add(it.next())
    }
    return Array.from(value).join(' ')
  }

  /**
   * Check if a line respect Sudoku lines rules.
   * @param line The line number to be checked.
   */
  checkLine(line:number) {
    assert.ok(line >= 0)
    assert.ok(line < 9)
    let check=Array(9).fill(0)
    for (let col=0; col<9; col++) {
      let index=line*9+col
      let val = this.getValue(index)
      if (val.length===0 || val.length>1) {
        continue
      }
      check[Number(val)-1]++
    }
    return checkArray(check)
  }

  /**
   * Check if a column respect Sudoku columns rules.
   * @param col The column number to be checked.
   */
  checkColumn(col:number) {
    assert.ok(col >= 0)
    assert.ok(col < 9)
    let check=Array(9).fill(0)
    for (let line=0; line<9; line++) {
      let index=line*9+col
      let val = this.getValue(index)
      if (val.length===0 || val.length>1) {
        continue
      }
      check[Number(val)-1]++
    }
    return checkArray(check)
  }

  /**
   * Check if a block respect Sudoku blocks rules.
   * @param block The block number to be checked.
   */
  checkBlock(block:number) {
    assert.ok(block >= 0)
    assert.ok(block < 9)
    let check=Array(9).fill(0)
    let listIndex=blockIndex(block)
    for (let index of listIndex) {
      let val = this.getValue(index)
      if (val.length===0 || val.length>1) {
        continue
      }
      check[Number(val)-1]++
    }
    return checkArray(check)
  }

  /**
   * This function check if all lines respect Sudoku lines rules.
   */
  validateLine() {
    let error=""
    for (let line=0; line<9; line++) {
      if (this.checkLine(line)===false) {
        error+="Erreur ligne "+ (line+1).toString()+" "
        let listIndex=[]
        for (let i=0; i<9; i++) {
          listIndex.push(line*9+i)
        }
        setErrorCell(listIndex)
      }
    }
    if (error) {
      console.log(error)
      return false
    }
    return true
  }

  /**
   * This function check if all columns respect Sudoku columns rules.
   */
  validateColumn() {
    let error=""
    for (let col=0; col<9; col++) {
      if (this.checkColumn(col)===false) {
        error+= "Erreur colonne "+ (col+1).toString()+" "
        let listIndex=[]
        for (let i=0; i<9; i++) {
          listIndex.push(i*9+col)
        }
        setErrorCell(listIndex)
      }
    }
    if (error) {
      console.log(error)
      return false
    }
    return true
  }

  /**
   * This function check if all blocks respect Sudoku blocks rules.
   */
  validateBlock() {
    let error=""
    for (let block=0; block<9; block++) {
      if (this.checkBlock(block)===false) {
        error+= "Erreur block "+ (block+1).toString()+" "
        let listIndex=blockIndex(block)
        setErrorCell(listIndex)
      }
    }
    if (error) {
      console.log(error)
      return false
    }
    return true
  }

  /**
   * This function check if all cells respect Sudoku rules.
   */
  validateSudoku() {
    let listIndex = []
    for (let i=0; i<9*9; i++) {
      listIndex.push(i)
    }
    removeErrorCell(listIndex)

    let error=""
    if (!this.validateLine()) {
      error="Error"
    }
    if (!this.validateColumn()) {
      error="Error"
    }
    if (!this.validateBlock()) {
      error="Error"
    }

    if (error) {
      return error
    }
    
    const regex = /^[1-9]$/
    for (let i=0;i<9*9;i++) {
      if (!regex.test(this.getValue(i))) {
        return "Continue"
      }
    }
    return "Complete"
  }
}

/**
 * Check if a array only contains values 0 or 1.
 * @param array The array to be checked.
 */
export function checkArray(array:any) {
  for (let i=0;i<array.length;i++) {
    if (array[i]!==0 && array[i]!==1) {
      return false
    }
  }
  return true
}

/**
 * Return the position of the first cell of a block.
 * @param block The block number of which we want the position.
 */
export function firstCellOfBlock(block:number) {
  assert.ok(block >= 0)
  assert.ok(block < 9)
  let line=Math.floor(block/3)*3
  let column=(block%3)*3
  return [line,column]
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
export function blockIndex(block: number) {
  assert.ok(block >= 0)
  assert.ok(block < 9)
  let blocklc=firstCellOfBlock(block)
  let line=blocklc[0]
  let col=blocklc[1]
  let index=[ line   *9 + col,   line   *9 + col+1,  line   *9 + col+2,
            (line+1)*9 + col,  (line+1)*9 + col+1, (line+1)*9 + col+2,
            (line+2)*9 + col,  (line+2)*9 + col+1, (line+2)*9 + col+2]
  return index
}

/**
 * Add a classname to a list of elements.
 * @param listId List of elements id.
 * @param classname ClassName to be added.
 */
function addClassName(listId: any, classname: string) {
  for (let id of listId) {
    const myElem = document.getElementById(String(id))
    if (myElem) {
      myElem.classList.add(classname)
    }
  }
}

/**
 * Remove a classname to a list of elements.
 * @param listId List of elements id.
 * @param classname ClassName to be removed.
 */
function removeClassName(listId: any, classname: string) {
  for (let id of listId) {
    const myElem = document.getElementById(String(id))
    if (myElem) {
      myElem.classList.remove(classname)
    }
  }
}

/**
 * Add errorcell class to a list of elements.
 * @param listId List of elements id.
 */
function setErrorCell(listId: any) {
  addClassName(listId, "errorcell")
}

/**
 * Remove errorcell class to a list of elements.
 * @param listId List of elements id.
 */
function removeErrorCell(listId: any) {
  removeClassName(listId, "errorcell")
}

export default Grid
