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
import { shallow } from "enzyme";
import Game from "./Game";

configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => ({}));
});

/**
 * This test evaluates that checkLine return true only if
 * the array contains all numbers from 1 to 9 without repeat.
 */
describe("checkLine", () => {
  test("checkLine", () => {
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkLine(3)).toBe(true);
    game.handleChange(35, "1");
    expect(game.checkLine(3)).toBe(false);
    game.handleChange(35, "2");
    expect(game.checkLine(3)).toBe(true);
  });
});

/**
 * This test evaluates that checkColumn return true only if
 * the array contains all numbers from 1 to 9 without repeat.
 */
describe("checkColumn", () => {
  test("checkColumn", () => {
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkColumn(8)).toBe(true);
    game.handleChange(35, "1");
    expect(game.checkColumn(8)).toBe(false);
    game.handleChange(35, "2");
    expect(game.checkColumn(8)).toBe(true);
  });
});

/**
 * This test evaluates that checkBlock return true only if
 * the array contains all numbers from 1 to 9 without repeat.
 */
describe("checkBlock", () => {
  test("checkBlock", () => {
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkBlock(5)).toBe(true);
    game.handleChange(35, "1");
    expect(game.checkBlock(5)).toBe(false);
    game.handleChange(35, "2");
    expect(game.checkBlock(5)).toBe(true);
  });
});

/**
 * This test evaluates that validateLine return false if a line contains an error.
 */
describe("validateLine", () => {
  /**
   * This test evaluates that validateLine return true with a line containing full empty cell.
   */
  test("validateLine empty", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkLines()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateLine return true with a line containing all numbers
   * from 1 to 9 without repeat.
   */
  test("validateLine complete", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkLines()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateLine return true if a line is missing a value.
   */
  test("validateLine with missing values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkLines()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateLine return false when a value is dupplicated.
   */
  test("validateLine with wrongs values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkLines()).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  /**
   * This test evaluates that validateLine return true when a cell has multiple values.
   */
  test("validateLine with multiples values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkLines()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkLines()).toStrictEqual([]);
  });
});

/**
 * This test evaluates that validateColumn return false if a column contains an error.
 */
describe("validateColumn", () => {
  /**
   * This test evaluates that validateColumn return true with a column containing full empty cell.
   */
  test("validateColumn empty", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkColumns()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateColumn return true with a column containing all numbers
   * from 1 to 9 without repeat.
   */
  test("validateColumn complete", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkColumns()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateColumn return true if a column is missing a value.
   */
  test("validateColumn with missing values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkColumns()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateColumn return false when a value is dupplicated.
   */
  test("validateColumn with wrongs values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
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
   * This test evaluates that validateColumn return true when a cell has multiple values.
   */
  test("validateColumn with multiples values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkColumns()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkColumns()).toStrictEqual([]);
  });
});

/**
 * This test evaluates that validateBlock return false if a line contains an error.
 */
describe("validateBlock", () => {
  /**
   * This test evaluates that validateBlock return true with a line containing full empty cell.
   */
  test("validateBlock empty", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkBlocks()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateBlock return true with a line containing all numbers
   * from 1 to 9 without repeat.
   */
  test("validateBlock complete", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkBlocks()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateBlock return true if a line is missing a value.
   */
  test("validateBlock with missing values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkBlocks()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateBlock return false when a value is dupplicated.
   */
  test("validateBlock with wrongs values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkBlocks()).toStrictEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
  });

  /**
   * This test evaluates that validateBlock return true when a cell has multiple values.
   */
  test("validateBlock with multiples values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkBlocks()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkBlocks()).toStrictEqual([]);
  });
});

/**
 * This test evaluates that validateSudoku return false if a line, column or block contains an error.
 */
describe("validateSudoku", () => {
  /**
   * This test evaluates that validateSudoku return true with a full empty game.
   */
  test("validateSudoku empty", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateSudoku return true with all lines, columns and blocks
   * containing all numbers from 1 to 9 without repeat.
   */
  test("validateSudoku complete", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateSudoku return true if the grid is missing a value.
   */
  test("validateSudoku with missing values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateSudoku return false when a value is dupplicated.
   */
  test("validateSudoku with wrongs values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkCells()).toStrictEqual([]);
  });

  /**
   * This test evaluates that validateSudoku return true when a cell has multiple values.
   */
  test("validateSudoku with multiples values", () => {
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
    const wrapper = shallow(<Game />);
    const game = wrapper.instance();

    expect(game.checkCells()).toStrictEqual([]);
    game.updateState(
      initVal.map((val) => ({ value: val, modifiable: false, error: false }))
    );
    expect(game.checkCells()).toStrictEqual([0, 1]);
  });
});
