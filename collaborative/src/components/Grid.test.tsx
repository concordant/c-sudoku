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
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";
import Grid, { cellsIndexOfBlock } from "./Grid";

configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => ({}));
});

/**
 * This test evaluates that getValue return the right initial value.
 */
describe("Cells initialization", () => {
  test("Cells initialization", () => {
    // prettier-ignore
    const initVal = ["6","","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
    const wrapper = mount(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );

    expect(wrapper.find({ id: "0" }).instance().value).toBe("6");
    expect(wrapper.find({ id: "1" }).instance().value).toBe("");
    expect(wrapper.find({ id: "3" }).instance().value).toBe("3");
  });
});

describe("Testing cells", () => {
  /**
   * This test evaluates that the grid display the right numbers of Cell.
   */
  test("Number of cells", () => {
    // prettier-ignore
    const initVal = ["6","5","","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]

    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    expect(wrapper.find("Cell")).toHaveLength(81);
  });
});

describe("Testing status", () => {
  /**
   * This test evaluates that the status field display "Complete" when the grid
   * is complete without errors.
   */
  test("Completed grid", () => {
    // prettier-ignore
    const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]

    const wrapper = mount(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const status = wrapper.find({ id: "status" });

    expect(status.text()).toBe("Sudoku completed");
  });
});

/**
 * This test evaluates that cellsIndexOfBlock return a list containing index of all cells of the same block.
 */
describe("cellsIndexOfBlock", () => {
  test("cellsIndexOfBlock", () => {
    expect(cellsIndexOfBlock(0)).toStrictEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]); // prettier-ignore
    expect(cellsIndexOfBlock(1)).toStrictEqual([3, 4, 5, 12, 13, 14, 21, 22, 23]); // prettier-ignore
    expect(cellsIndexOfBlock(2)).toStrictEqual([ 6, 7, 8, 15, 16, 17, 24, 25, 26]); // prettier-ignore
    expect(cellsIndexOfBlock(4)).toStrictEqual([30, 31, 32, 39, 40, 41, 48, 49, 50]); // prettier-ignore
    expect(cellsIndexOfBlock(8)).toStrictEqual([60, 61, 62, 69, 70, 71, 78, 79, 80]); // prettier-ignore
  });
});

/**
 * This test evaluates that checkLine return true only if
 * the array contains all numbers from 1 to 9 without repeat.
 */
describe("checkLine", () => {
  test("checkLine", () => {
    // prettier-ignore
    const initVal = ["","","","","","","","","",
                      "1","2","3","4","5","6","7","8","9",
                      "1","2","3","","5","6","7","8","9",
                      "1","1","3","4","5","6","7","8","9",
                      "5","9","6","2","7","4","8","3","1",
                      "4","7","3","8","6","1","5","2","9",
                      "1","8","7","5","2","9","","","3",
                      "2","3","4","6","1","8","7","9","5",
                      "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const grid = wrapper.instance();

    expect(grid.checkLine(0)).toBe(true);
    expect(grid.checkLine(1)).toBe(true);
    expect(grid.checkLine(2)).toBe(true);
    expect(grid.checkLine(3)).toBe(false);
    expect(grid.checkLine(4)).toBe(true);
    expect(grid.checkLine(5)).toBe(true);
  });
});

/**
 * This test evaluates that checkColumn return true only if
 * the array contains all numbers from 1 to 9 without repeat.
 */
describe("checkColumn", () => {
  test("checkColumn", () => {
    // prettier-ignore
    const initVal = ["","1","1","1","8","7","9","1","4",
                     "","2","2","1","5","2","3","6","8",
                     "","3","3","3","9","6","2","5","7",
                     "","4","","4","3","5","4","7","6",
                     "","5","5","5","7","4","8","3","1",
                     "","6","6","6","6","1","5","2","9",
                     "","7","7","7","2","9","","","3",
                     "","8","8","8","1","8","7","9","5",
                     "","9","9","9","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const grid = wrapper.instance();

    expect(grid.checkColumn(0)).toBe(true);
    expect(grid.checkColumn(1)).toBe(true);
    expect(grid.checkColumn(2)).toBe(true);
    expect(grid.checkColumn(3)).toBe(false);
    expect(grid.checkColumn(4)).toBe(true);
    expect(grid.checkColumn(5)).toBe(true);
  });
});

/**
 * This test evaluates that checkBlock return true only if
 * the array contains all numbers from 1 to 9 without repeat.
 */
describe("checkBlock", () => {
  test("checkBlock", () => {
    // prettier-ignore
    const initVal = ["","","","1","2","3","1","2","3",
                     "","","","4","5","6","4","5","",
                     "","","","7","8","9","7","8","9",
                     "1","1","2","9","3","5","4","7","6",
                     "3","4","5","2","7","4","8","3","1",
                     "6","7","8","8","6","1","5","2","9",
                     "1","8","7","5","2","9","","","3",
                     "2","3","4","6","1","8","7","9","5",
                     "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const grid = wrapper.instance();

    expect(grid.checkBlock(0)).toBe(true);
    expect(grid.checkBlock(1)).toBe(true);
    expect(grid.checkBlock(2)).toBe(true);
    expect(grid.checkBlock(3)).toBe(false);
    expect(grid.checkBlock(4)).toBe(true);
    expect(grid.checkBlock(5)).toBe(true);
  });
});

/**
 * This test evaluates that checkLines return false if a line contains an error.
 */
describe("checkLines", () => {
  /**
   * This test evaluates that checkLines return true with a line containing full empty cell.
   */
  test("checkLines empty", () => {
    // prettier-ignore
    const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkLines return true with a line containing all numbers
   * from 1 to 9 without repeat.
   */
  test("checkLines complete", () => {
    // prettier-ignore
    const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkLines return true if a line is missing a value.
   */
  test("checkLines with missing values", () => {
    // prettier-ignore
    const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkLines return false when a value is dupplicated.
   */
  test("checkLines with wrongs values", () => {
    // prettier-ignore
    const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  /**
   * This test evaluates that checkLines return true when a cell has multiple values.
   */
  test("checkLines with multiples values", () => {
    // prettier-ignore
    const initVal = ["1 6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
  });
});

/**
 * This test evaluates that checkColumns return false if a column contains an error.
 */
describe("checkColumns", () => {
  /**
   * This test evaluates that checkColumns return true with a column containing full empty cell.
   */
  test("checkColumns empty", () => {
    // prettier-ignore
    const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkColumns return true with a column containing all numbers
   * from 1 to 9 without repeat.
   */
  test("checkColumns complete", () => {
    // prettier-ignore
    const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkColumns return true if a column is missing a value.
   */
  test("checkColumns with missing values", () => {
    // prettier-ignore
    const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkColumns return false when a value is dupplicated.
   */
  test("checkColumns with wrongs values", () => {
    // prettier-ignore
    const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([
      1,
      10,
      19,
      28,
      37,
      46,
      55,
      64,
      73,
    ]);
  });

  /**
   * This test evaluates that checkColumns return true when a cell has multiple values.
   */
  test("checkColumns with multiples values", () => {
    // prettier-ignore
    const initVal = ["1 6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
  });
});

/**
 * This test evaluates that checkBlocks return false if a line contains an error.
 */
describe("checkBlocks", () => {
  /**
   * This test evaluates that checkBlocks return true with a line containing full empty cell.
   */
  test("checkBlocks empty", () => {
    // prettier-ignore
    const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkBlocks return true with a line containing all numbers
   * from 1 to 9 without repeat.
   */
  test("checkBlocks complete", () => {
    // prettier-ignore
    const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkBlocks return true if a line is missing a value.
   */
  test("checkBlocks with missing values", () => {
    // prettier-ignore
    const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkBlocks return false when a value is dupplicated.
   */
  test("checkBlocks with wrongs values", () => {
    // prettier-ignore
    const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
  });

  /**
   * This test evaluates that checkBlocks return true when a cell has multiple values.
   */
  test("checkBlocks with multiples values", () => {
    // prettier-ignore
    const initVal = ["1 6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
  });
});

/**
 * This test evaluates that checkCells return false if a line, column or block contains an error.
 */
describe("checkCells", () => {
  /**
   * This test evaluates that checkCells return true with a full empty game.
   */
  test("checkCells empty", () => {
    // prettier-ignore
    const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkCells return true with all lines, columns and blocks
   * containing all numbers from 1 to 9 without repeat.
   */
  test("checkCells complete", () => {
    // prettier-ignore
    const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkCells return true if the grid is missing a value.
   */
  test("checkCells with missing values", () => {
    // prettier-ignore
    const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkCells return false when a value is dupplicated.
   */
  test("checkCells with wrongs values", () => {
    // prettier-ignore
    const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that checkCells return true when a cell has multiple values.
   */
  test("checkCells with multiples values", () => {
    // prettier-ignore
    const initVal = ["1 6","5 2","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
    const wrapper = shallow(
      <Grid
        cells={initVal.map((val) => ({
          value: val,
          modifiable: false,
        }))}
        onChange={() => ({})}
      />
    );
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([0, 1]);
  });
});
