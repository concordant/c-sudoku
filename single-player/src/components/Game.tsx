/**
 * MIT License
 *
 * Copyright (c) 2022, Concordant and contributors
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
import Grid from "./Grid";
import { GRIDS } from "../constants";

/**
 * Interface for the state of a Game.
 * Keep a reference to the opened session and opened MVMap.
 */
interface IGameState {
  cells: { value: string; modifiable: boolean }[];
}

/**
 * This class represent the Game that glues all components together.
 */
class Game extends React.Component<Record<string, unknown>, IGameState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    const cells = new Array(81)
      .fill(null)
      .map(() => ({ value: "", modifiable: false }));
    this.state = {
      cells: cells,
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
    this.setState({ cells: cells });
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
    this.setState({ cells: cells });
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
    this.setState({ cells: cells });
  }

  render(): JSX.Element {
    return (
      <div className="sudoku">
        <div>
          <button onClick={this.reset.bind(this)}>Reset</button>
        </div>
        <br />
        <Grid
          cells={this.state.cells}
          onChange={(index: number, value: string) =>
            this.handleChange(index, value)
          }
        />
      </div>
    );
  }
}

/**
 * Return a predefined Sudoku grid as a string.
 */
function generateStaticGrid(): string {
  return GRIDS["1"];
}

export default Game;
