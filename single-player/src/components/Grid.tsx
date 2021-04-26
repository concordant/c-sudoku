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

/**
 * Interface for the properties of the Grid
 */
interface IGridProps {
  cells: { value: string; modifiable: boolean; error: boolean }[];
  isFinished: boolean;
  onChange: (index: number, value: string) => void;
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps> {
  handleChange(index: number, value: string): void {
    this.props.onChange(index, value);
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
        value={this.props.cells[index].value}
        onChange={
          this.props.cells[index].modifiable
            ? (index: number, value: string) => this.handleChange(index, value)
            : null
        }
        error={this.props.cells[index].error}
      />
    );
  }

  /**
   * This function return a React element corresponding to a block of cell.
   * @param blockNum The index of the block to render.
   */
  renderBlock(blockNum: number): JSX.Element {
    assert.ok(blockNum >= 0 && blockNum < 9);
    const index = cellsIndexOfBlock(blockNum);
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
      <div>
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
        {this.props.isFinished && (
          <h2 className="status" id="status">
            Sudoku completed
          </h2>
        )}
      </div>
    );
  }
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
export function cellsIndexOfBlock(block: number): number[] {
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
