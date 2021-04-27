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

/**
 * Interface for the state of the Grid
 */
interface IGridState {
  cells: { value: string; modifiable: boolean; error: boolean }[];
  isFinished: boolean;
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<Record<string, unknown>, IGridState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    const cells = new Array(81)
      .fill(null)
      .map(() => ({ value: "", modifiable: false, error: false }));
    this.state = {
      cells: cells,
      isFinished: false,
    };
  }

  /**
   * Called after the component is rendered.
   * It set a timer to refresh cells values.
   */
  componentDidMount(): void {
    this.initFrom(generateStaticGrid());
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
        <div>
          <button onClick={this.reset.bind(this)}>Reset</button>
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
 */
function generateStaticGrid(): string {
  return GRIDS["1"];
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
function blockIndex(block: number): number[] {
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

export default Grid;
