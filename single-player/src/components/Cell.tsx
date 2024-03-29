import React from "react";
import { validInput } from "../constants";

/**
 * Interface for the properties of the Cell.
 * The Cell needs to know his index in the grid, his value, a callback function
 * used when the value is modified and if we are allowed to modify the value.
 */
interface ICellProps {
  index: number;
  value: string;
  onChange: ((index: number, value: string) => void) | null;
  error: boolean;
}

/**
 * This class represent a cell of the Sudoku
 */
class Cell extends React.Component<ICellProps> {
  /**
   * onChange event handler
   * @param event handled
   */
  onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (this.props.onChange === null) {
      return;
    }
    if (event.target.value === "" || validInput.test(event.target.value)) {
      this.props.onChange(this.props.index, event.target.value);
    }
  }

  render(): JSX.Element {
    let cellClass = "";
    if (this.props.value.length > 1) {
      cellClass += "mv ";
    }
    if (this.props.onChange === null) {
      cellClass += "locked ";
    }
    if (this.props.error) {
      cellClass += "wrongvalue ";
    }
    return (
      <input
        id={String(this.props.index)}
        className={cellClass}
        maxLength={1}
        value={this.props.value}
        onChange={(event) => this.onChange(event)}
        readOnly={this.props.onChange === null}
      />
    );
  }
}

export default Cell;
