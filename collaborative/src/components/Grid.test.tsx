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
    const wrapper = mount(<Grid cells={initVal.map(val =>({ value: val, modifiable: false, error: false }))} isFinished={false} onChange={() => ({})} />);

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

    const wrapper = shallow(<Grid cells={initVal.map(val =>({ value: val, modifiable: false, error: false }))} isFinished={false} onChange={() => ({})} />);
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

    const wrapper = mount(<Grid cells={initVal.map(val =>({ value: val, modifiable: false, error: false }))} isFinished={true} onChange={() => ({})} />);
    const status = wrapper.find({ id: "status" });
    expect(status.text()).toBe("Sudoku completed");
  });
});

/**
 * This test evaluates that cellsIndexOfBlock return a list containing index of all cells of the same block.
 */
 describe("cellsIndexOfBlock", () => {
  test("cellsIndexOfBlock", () => {
    expect(cellsIndexOfBlock(0)).toStrictEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
    expect(cellsIndexOfBlock(1)).toStrictEqual([3, 4, 5, 12, 13, 14, 21, 22, 23]);
    expect(cellsIndexOfBlock(2)).toStrictEqual([6, 7, 8, 15, 16, 17, 24, 25, 26]);
    expect(cellsIndexOfBlock(4)).toStrictEqual([30, 31, 32, 39, 40, 41, 48, 49, 50]);
    expect(cellsIndexOfBlock(8)).toStrictEqual([60, 61, 62, 69, 70, 71, 78, 79, 80]);
  });
});
