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
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, render } from 'enzyme';
import Grid from "./Grid"
import {checkArray, firstCellOfBlock, blockIndex} from "./Grid"
import { crdtlib } from '@concordant/c-crdtlib';

configure({ adapter: new Adapter() });

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe("checkArray", () => {
    test("checkArray", () => {
        expect(checkArray([0,1,2,3])).toBe(false);
        expect(checkArray([0,1,0,1])).toBe(true);
    });
});

describe("firstCellOfBlock", () => {
    test("firstCellOfBlock", () => {
        expect(firstCellOfBlock(0)).toStrictEqual([0, 0]);
        expect(firstCellOfBlock(1)).toStrictEqual([0, 3]);
        expect(firstCellOfBlock(2)).toStrictEqual([0, 6]);
        expect(firstCellOfBlock(4)).toStrictEqual([3, 3]);
        expect(firstCellOfBlock(8)).toStrictEqual([6, 6]);
    });
});

describe("blockIndex", () => {
    test("blockIndex", () => {
        expect(blockIndex(0)).toStrictEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
        expect(blockIndex(1)).toStrictEqual([3, 4, 5, 12, 13, 14, 21, 22, 23]);
        expect(blockIndex(2)).toStrictEqual([6, 7, 8, 15, 16, 17, 24, 25, 26]);
        expect(blockIndex(4)).toStrictEqual([30, 31, 32, 39, 40, 41, 48, 49, 50]);
        expect(blockIndex(8)).toStrictEqual([60, 61, 62, 69, 70, 71, 78, 79, 80]);
    });
});

describe ("getValue", () => {
    test("getValue", () => {
        const initVal = ["6","","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let envs = Array(9)
        let newvals = Array(9)
        for (let i = 0; i<9; i++){
            envs[i] = new crdtlib.utils.SimpleEnvironment(
                new crdtlib.utils.ClientUId("myClientId"+i));
            newvals[i] = new crdtlib.crdt.MVRegister()
            newvals[i].set(String(i+1), envs[i].tick())
            grid.state.cells[1].merge(newvals[i])
        }
        expect(grid.getValue(0)).toBe("6")
        expect(grid.getValue(1)).toBe("1 2 3 4 5 6 7 8 9")
        expect(grid.getValue(2)).toBe("")
    });
});

describe ("handleChange", () => {
    test("handleChange", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]

        const wrapper = mount(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.getValue(4)).toBe("8")
        grid.handleChange(4, "2")
        expect(grid.getValue(4)).toBe("2")
    });
});

describe("checkLine", () => {
    test("checkLine", () => {
        const initVal = ["","","","","","","","","",
                        "1","2","3","4","5","6","7","8","9",
                        "1","2","3","","5","6","7","8","9",
                        "1","1","3","4","5","6","7","8","9",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId1"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[45].merge(newval)

        expect(grid.checkLine(0)).toBe(true)
        expect(grid.checkLine(1)).toBe(true)
        expect(grid.checkLine(2)).toBe(true)
        expect(grid.checkLine(3)).toBe(false)
        expect(grid.checkLine(4)).toBe(true)
        expect(grid.checkLine(5)).toBe(true)
    });
});

describe("checkColumn", () => {
    test("checkColumn", () => {
        const initVal = ["","1","1","1","8","7","9","1","4",
                       "","2","2","1","5","2","3","6","8",
                       "","3","3","3","9","6","2","5","7",
                       "","4","","4","3","5","4","7","6",
                       "","5","5","5","7","4","8","3","1",
                       "","6","6","6","6","1","5","2","9",
                       "","7","7","7","2","9","","","3",
                       "","8","8","8","1","8","7","9","5",
                       "","9","9","9","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId1"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[5].merge(newval)

        expect(grid.checkColumn(0)).toBe(true)
        expect(grid.checkColumn(1)).toBe(true)
        expect(grid.checkColumn(2)).toBe(true)
        expect(grid.checkColumn(3)).toBe(false)
        expect(grid.checkColumn(4)).toBe(true)
        expect(grid.checkColumn(5)).toBe(true)
    });
});

describe("checkBlock", () => {
    test("checkBlock", () => {
        const initVal = ["","","","1","2","3","1","2","3",
                       "","","","4","5","6","4","5","",
                       "","","","7","8","9","7","8","9",
                       "1","1","2","9","3","5","4","7","6",
                       "3","4","5","2","7","4","8","3","1",
                       "6","7","8","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[3].merge(newval)

        expect(grid.checkBlock(0)).toBe(true)
        expect(grid.checkBlock(1)).toBe(true)
        expect(grid.checkBlock(2)).toBe(true)
        expect(grid.checkBlock(3)).toBe(false)
        expect(grid.checkBlock(4)).toBe(true)
        expect(grid.checkBlock(5)).toBe(true)
    });
});

describe("validateLine", () => {
    test("validateLine empty", () => {
        const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateLine()).toBe(true)
    });

    test("validateLine complete", () => {
        const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateLine()).toBe(true)
    });

    test("validateLine with missing values", () => {
        const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateLine()).toBe(true)
    });

    test("validateLine with wrongs values", () => {
        const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateLine()).toBe(false)
    });

    test("validateLine with multiples values", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[1].merge(newval)

        expect(grid.validateLine()).toBe(true)
    });
});

describe("validateColumn", () => {
    test("validateColumn empty", () => {
        const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateColumn()).toBe(true)
    });

    test("validateColumn complete", () => {
        const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateColumn()).toBe(true)
    });

    test("validateColumn with missing values", () => {
        const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateColumn()).toBe(true)
    });

    test("validateColumn with wrongs values", () => {
        const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateColumn()).toBe(false)
    });

    test("validateColumn with multiples values", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[1].merge(newval)

        expect(grid.validateColumn()).toBe(true)
    });
});

describe("validateBlock", () => {
    test("validateBlock empty", () => {
        const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateBlock()).toBe(true)
    });

    test("validateBlock complete", () => {
        const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateBlock()).toBe(true)
    });

    test("validateBlock with missing values", () => {
        const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateBlock()).toBe(true)
    });

    test("validateBlock with wrongs values", () => {
        const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateBlock()).toBe(false)
    });

    test("validateBlock with multiples values", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[1].merge(newval)

        expect(grid.validateBlock()).toBe(true)
    });
});

describe("validateSudoku", () => {
    test("validateSudoku empty", () => {
        const initVal = ["","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","","",
                        "","","","","","","","",""]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateSudoku()).toBe("Continue")
    });

    test("validateSudoku complete", () => {
        const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateSudoku()).toBe("Complete")
    });

    test("validateSudoku with missing values", () => {
        const initVal = ["6","","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateSudoku()).toBe("Continue")
    });

    test("validateSudoku with wrongs values", () => {
        const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()
        expect(grid.validateSudoku()).toBe("Error")
    });

    test("validateSudoku with multiples values", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]
        const wrapper = shallow(<Grid initial = {initVal}/>)
        const grid = wrapper.instance()

        let env = new crdtlib.utils.SimpleEnvironment(
            new crdtlib.utils.ClientUId("myClientId"));
        let newval = new crdtlib.crdt.MVRegister()
        newval.set("1", env.tick())
        grid.state.cells[1].merge(newval)

        expect(grid.validateSudoku()).toBe("Continue")
    });
});

describe("Testing status", () => {
    test("UI status continue", () => {
        const initVal = ["","5","2","3","8","7","9","1","4",
                       "7","1","9","4","5","2","3","6","8",
                       "3","4","8","1","9","6","2","5","7",
                       "8","2","1","9","3","5","4","7","6",
                       "5","9","6","2","7","4","8","3","1",
                       "4","7","3","8","6","1","5","2","9",
                       "1","8","7","5","2","9","","","3",
                       "2","3","4","6","1","8","7","9","5",
                       "","6","5","7","4","3","1","8","2"]

        const wrapper = shallow(<Grid initial = {initVal}/>)
        const status = wrapper.find('.status')
        expect(status.text()).toBe("Status : Continue")
    });

    test("UI status error", () => {
        const initVal = ["6","2","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]

        const wrapper = shallow(<Grid initial = {initVal}/>)
        const status = wrapper.find('.status')
        expect(status.text()).toBe("Status : Error")
    });

    test("UI status complete", () => {
        const initVal = ["6","5","2","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","6","4","3",
                        "2","3","4","6","1","8","7","9","5",
                        "9","6","5","7","4","3","1","8","2"]

        const wrapper = shallow(<Grid initial = {initVal}/>)
        const status = wrapper.find('.status')
        expect(status.text()).toBe("Status : Complete")
    });
});

describe("Testing cells", () => {
    test("Number of cells", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]

        const wrapper = shallow(<Grid initial = {initVal}/>)
        expect(wrapper.find('Cell')).toHaveLength(81)
    });

    test("Cell initialization", () => {
        const initVal = ["6","5","","3","8","7","9","1","4",
                        "7","1","9","4","5","2","3","6","8",
                        "3","4","8","1","9","6","2","5","7",
                        "8","2","1","9","3","5","4","7","6",
                        "5","9","6","2","7","4","8","3","1",
                        "4","7","3","8","6","1","5","2","9",
                        "1","8","7","5","2","9","","","3",
                        "2","3","4","6","1","8","7","9","5",
                        "","6","5","7","4","3","1","8","2"]

        const wrapper = mount(<Grid initial = {initVal}/>)
        expect(wrapper.find('Cell').first().text()).toBe("6")
    });
});
