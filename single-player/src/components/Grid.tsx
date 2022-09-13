import React from "react";
import assert from "assert";
import Cell from "./Cell";
import { validInput } from "../constants";

/**
 * Interface for the properties of the Grid
 */
interface IGridProps {
  cells: { value: string; modifiable: boolean }[];
  onChange: (index: number, value: string) => void;
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps> {
  errors: boolean[] = new Array(81).fill(false);

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
        error={this.errors[index]}
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
    const isFinished = this.checkAll();
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
        {isFinished && (
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
      const val = this.props.cells[index].value;
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
      const val = this.props.cells[index].value;
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
    const indexList = cellsIndexOfBlock(block);
    for (const index of indexList) {
      const val = this.props.cells[index].value;
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
        indexList = indexList.concat(cellsIndexOfBlock(block));
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
      const val = this.props.cells[cell].value;
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
  checkAll(): boolean {
    let errorIndexList = this.checkLines();
    errorIndexList = errorIndexList.concat(this.checkColumns());
    errorIndexList = errorIndexList.concat(this.checkBlocks());
    errorIndexList = errorIndexList.concat(this.checkCells());

    const errorIndexSet = new Set(errorIndexList);

    for (let index = 0; index < 81; index++) {
      if (errorIndexSet.has(index)) {
        this.errors[index] = true;
      } else {
        this.errors[index] = false;
      }
    }

    if (errorIndexSet.size) {
      return false;
    }

    for (let index = 0; index < 81; index++) {
      if (!validInput.test(this.props.cells[index].value)) {
        return false;
      }
    }

    return true;
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
