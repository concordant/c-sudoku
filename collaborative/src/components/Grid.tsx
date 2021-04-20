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

import React from "react";
import assert from "assert";
import Cell from "./Cell";
import { validInput, GRIDS } from "../constants";
import { client } from "@concordant/c-client";
import Submit1Input from "./Submit1Input";

/**
 * Interface for the properties of the Grid
 */
interface IGridProps {
  session: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  collection: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Interface for the state of the Grid
 */
interface IGridState {
  gridNum: string;
  mvmap: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  cells: { value: string; modifiable: boolean; error: boolean }[];
  isConnected: boolean;
  isFinished: boolean;
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps, IGridState> {
  timerID!: NodeJS.Timeout;
  modifiedCells: string[];

  constructor(props: IGridProps) {
    super(props);
    const cells = new Array(81)
      .fill(null)
      .map(() => ({ value: "", modifiable: false, error: false }));
    this.modifiedCells = new Array(81).fill(null);
    const gridNum = "1";
    const mvmap = this.props.collection.open(
      "grid" + gridNum,
      "MVMap",
      false,
      function () {
        return;
      }
    );
    this.state = {
      gridNum: gridNum,
      mvmap: mvmap,
      cells: cells,
      isConnected: true,
      isFinished: false,
    };
  }

  /**
   * Called after the component is rendered.
   * It set a timer to refresh cells values.
   */
  componentDidMount(): void {
    this.initFrom(generateStaticGrid(this.state.gridNum));
    this.timerID = setInterval(() => this.updateGrid(), 1000);
  }

  /**
   * Called when the compenent is about to be removed from the DOM.
   * It remove the timer set in componentDidMount().
   */
  componentWillUnmount(): void {
    clearInterval(this.timerID);
  }

  /**
   * Update cells values from C-Client.
   */
  updateGrid(): void {
    const cells = this.state.cells;
    if (!this.state.isConnected) {
      console.error("updateGrid() called while not connected.");
      return;
    }
    for (let index = 0; index < 81; index++) {
      if (cells[index].modifiable) {
        cells[index].value = "";
      }
    }
    this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
      const itString = this.state.mvmap.iteratorString();
      while (itString.hasNext()) {
        const val = itString.next();
        cells[val.first].value = hashSetToString(val.second);
      }
    });
    this.updateState(cells);
  }

  /**
   * This function is used to simulate the offline mode.
   */
  switchConnection(): void {
    if (this.state.isConnected) {
      this.modifiedCells = new Array(81).fill(null);
      clearInterval(this.timerID);
    } else {
      for (let index = 0; index < 81; index++) {
        if (
          this.state.cells[index].modifiable &&
          this.modifiedCells[index] !== null
        ) {
          this.props.session.transaction(
            client.utils.ConsistencyLevel.None,
            () => {
              this.state.mvmap.setString(index, this.modifiedCells[index]);
            }
          );
        }
      }
      this.timerID = setInterval(() => this.updateGrid(), 1000);
    }
    this.setState({ isConnected: !this.state.isConnected });
  }

  /**
   * Initialize the grid with the given values.
   * @param values values to be set in the grid.
   */
  initFrom(values: string): void {
    assert.ok(values.length === 81);
    const cells = this.state.cells;
    for (let index = 0; index < 81; index++) {
      cells[index].value = values[index] === "." ? "" : values[index];
      cells[index].modifiable = values[index] === "." ? true : false;
    }
    this.updateState(cells);
  }

  /**
   * Reset the value of all modifiable cells.
   */
  reset(): void {
    const cells = this.state.cells;
    for (let index = 0; index < 81; index++) {
      if (cells[index].modifiable) {
        cells[index].value = "";
        if (this.state.isConnected) {
          this.props.session.transaction(
            client.utils.ConsistencyLevel.None,
            () => {
              this.state.mvmap.setString(index, cells[index].value);
            }
          );
        } else {
          this.modifiedCells[index] = "";
        }
      }
    }
    this.updateState(cells);
  }

  /**
   * This handler is called when the value of a cell is changed.
   * @param index The index of the cell changed.
   * @param value The new value of the cell.
   */
  handleChange(index: number, value: string): void {
    assert.ok(value === "" || (Number(value) >= 1 && Number(value) <= 9));
    assert.ok(index >= 0 && index < 81);
    if (!this.state.cells[index].modifiable) {
      console.error(
        "Trying to change an non modifiable cell. Should not happend"
      );
    }

    const cells = this.state.cells;
    cells[index].value = value;
    this.updateState(cells);

    if (this.state.isConnected) {
      this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
        this.state.mvmap.setString(index, value);
      });
    } else {
      this.modifiedCells[index] = value;
    }
  }

  /**
   * This handler is called when a new grid number is submit.
   * @param gridNum Desired grid number.
   */
  handleSubmit(gridNum: string): void {
    if (
      Number(gridNum) < 1 ||
      Number(gridNum) > 100 ||
      gridNum === this.state.gridNum
    ) {
      return;
    }
    const mvmap = this.props.collection.open(
      "grid" + gridNum,
      "MVMap",
      false,
      function () {
        return;
      }
    );
    this.setState({ gridNum: gridNum, mvmap: mvmap });
    this.initFrom(generateStaticGrid(gridNum));
  }

  /**
   * This function return a React element corresponding to a cell.
   * @param index The index of the cell to render.
   */
  renderCell(index: number): JSX.Element {
    assert.ok(index >= 0 && index < 81);
    return (
      <Cell
        index={index}
        value={this.state.cells[index].value}
        onChange={
          this.state.cells[index].modifiable
            ? (index: number, value: string) => this.handleChange(index, value)
            : null
        }
        error={this.state.cells[index].error}
      />
    );
  }

  /**
   * This function return a React element corresponding to a block of cell.
   * @param blockNum The index of the block to render.
   */
  renderBlock(blockNum: number): JSX.Element {
    assert.ok(blockNum >= 0 && blockNum < 9);
    const index = blockIndex(blockNum);
    return (
      <td>
        {this.renderCell(index[0])}
        {this.renderCell(index[1])}
        {this.renderCell(index[2])}
        <br />
        {this.renderCell(index[3])}
        {this.renderCell(index[4])}
        {this.renderCell(index[5])}
        <br />
        {this.renderCell(index[6])}
        {this.renderCell(index[7])}
        {this.renderCell(index[8])}
      </td>
    );
  }

  /**
   * The function is called when the grid is updated. It return a React element corresponding to the grid of the Sudoku.
   */
  render(): JSX.Element {
    return (
      <div className="sudoku">
        <div>Current grid : {this.state.gridNum}</div>
        <Submit1Input
          inputName="Grid"
          onSubmit={this.handleSubmit.bind(this)}
        />
        <div>
          Difficulty levels: easy (1-20), medium (21-40), hard (41-60),
          very-hard (61-80), insane (81-100)
        </div>
        <br />
        <div>
          <button onClick={this.reset.bind(this)}>Reset</button>
        </div>
        <br />
        <div>
          <button onClick={() => this.switchConnection()}>
            {this.state.isConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
        <br />
        <table className="grid">
          <tbody>
            {[0, 1, 2].map((line) => (
              <tr key={line.toString()}>
                {this.renderBlock(line * 3)}
                {this.renderBlock(line * 3 + 1)}
                {this.renderBlock(line * 3 + 2)}
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.isFinished && (
          <h2 className="status" id="status">
            Sudoku completed
          </h2>
        )}
      </div>
    );
  }

  /**
   * Check if a line respect Sudoku lines rules.
   * @param line The line number to be checked.
   */
  checkLine(line: number): boolean {
    assert.ok(line >= 0 && line < 9);
    const cpt = Array(9).fill(0);
    for (let column = 0; column < 9; column++) {
      const index = line * 9 + column;
      const val = this.state.cells[index].value;
      if (val.length === 0 || val.length > 1) {
        continue;
      }
      cpt[Number(val) - 1]++;
    }
    return cpt.every((c) => c <= 1);
  }

  /**
   * Check if a column respect Sudoku columns rules.
   * @param column The column number to be checked.
   */
  checkColumn(column: number): boolean {
    assert.ok(column >= 0 && column < 9);
    const cpt = Array(9).fill(0);
    for (let line = 0; line < 9; line++) {
      const index = line * 9 + column;
      const val = this.state.cells[index].value;
      if (val.length === 0 || val.length > 1) {
        continue;
      }
      cpt[Number(val) - 1]++;
    }
    return cpt.every((c) => c <= 1);
  }

  /**
   * Check if a block respect Sudoku blocks rules.
   * @param block The block number to be checked.
   */
  checkBlock(block: number): boolean {
    assert.ok(block >= 0 && block < 9);
    const cpt = Array(9).fill(0);
    const indexList = blockIndex(block);
    for (const index of indexList) {
      const val = this.state.cells[index].value;
      if (val.length === 0 || val.length > 1) {
        continue;
      }
      cpt[Number(val) - 1]++;
    }
    return cpt.every((c) => c <= 1);
  }

  /**
   * This function check if all lines respect Sudoku lines rules.
   */
  checkLines(): number[] {
    const indexList = [];
    for (let line = 0; line < 9; line++) {
      if (this.checkLine(line) === false) {
        for (let column = 0; column < 9; column++) {
          indexList.push(line * 9 + column);
        }
      }
    }
    return indexList;
  }

  /**
   * This function check if all columns respect Sudoku columns rules.
   */
  checkColumns(): number[] {
    const indexList = [];
    for (let column = 0; column < 9; column++) {
      if (this.checkColumn(column) === false) {
        for (let line = 0; line < 9; line++) {
          indexList.push(line * 9 + column);
        }
      }
    }
    return indexList;
  }

  /**
   * This function check if all blocks respect Sudoku blocks rules.
   */
  checkBlocks(): number[] {
    let indexList: number[] = [];
    for (let block = 0; block < 9; block++) {
      if (this.checkBlock(block) === false) {
        indexList = indexList.concat(blockIndex(block));
      }
    }
    return indexList;
  }

  /**
   * This function check if cells contains multiple values.
   */
  checkCells(): number[] {
    const indexList = [];
    for (let cell = 0; cell < 81; cell++) {
      const val = this.state.cells[cell].value;
      if (val.length > 1) {
        indexList.push(cell);
      }
    }
    return indexList;
  }

  /**
   * Check if all cells respect Sudoku rules and update cells.
   * @param cells Current cells values.
   */
  updateState(
    cells: { value: string; modifiable: boolean; error: boolean }[]
  ): void {
    let errorIndexList = this.checkLines();
    errorIndexList = errorIndexList.concat(this.checkColumns());
    errorIndexList = errorIndexList.concat(this.checkBlocks());
    errorIndexList = errorIndexList.concat(this.checkCells());

    const errorIndexSet = new Set(errorIndexList);

    for (let index = 0; index < 81; index++) {
      if (errorIndexSet.has(index)) {
        cells[index].error = true;
      } else {
        cells[index].error = false;
      }
    }

    if (errorIndexSet.size) {
      this.setState({ cells: cells, isFinished: false });
      return;
    }

    for (let index = 0; index < 81; index++) {
      if (!validInput.test(this.state.cells[index].value)) {
        this.setState({ cells: cells, isFinished: false });
        return;
      }
    }
    this.setState({ cells: cells, isFinished: true });
  }
}

/**
 * Return a predefined Sudoku grid as a string.
 * @param gridNum Desired grid number
 */
function generateStaticGrid(gridNum: string) {
  return GRIDS[gridNum];
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
function blockIndex(block: number) {
  assert.ok(block >= 0 && block < 9);
  const line = Math.floor(block / 3) * 3;
  const column = (block % 3) * 3;
  const index = [
    line * 9 + column,
    line * 9 + column + 1,
    line * 9 + column + 2,
    (line + 1) * 9 + column,
    (line + 1) * 9 + column + 1,
    (line + 1) * 9 + column + 2,
    (line + 2) * 9 + column,
    (line + 2) * 9 + column + 1,
    (line + 2) * 9 + column + 2,
  ];
  return index;
}

/**
 * Concatenates all values of a HashSet as a String.
 * @param set HashSet to be concatenated.
 */
function hashSetToString(set: any): string {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = new Set();
  const it = set.iterator();
  while (it.hasNext()) {
    const val = it.next();
    if (val !== "") {
      res.add(val);
    }
  }
  return Array.from(res).sort().join(" ");
}

export default Grid;
