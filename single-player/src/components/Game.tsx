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
