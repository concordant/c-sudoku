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
import { mount } from 'enzyme';
import Cell from "./Cell"

configure({ adapter: new Adapter() });

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe("Testing UI", () => {
    test("Cell initialization", () => {
        const wrapper = mount(<Cell
            index={3}
            value={"6"}
            onChange={(index:number, value:string) => {}}
            lock={false}
          />)
        expect(wrapper.find('textarea').text()).toBe("6")
    });

    test("Cell value changed", () => {
        const wrapper = mount(<Cell
            index={3}
            value={"6"}
            onChange={(index:number, value:string) => {}}
            lock={false}
          />)
        expect(wrapper.find('textarea').text()).toBe("6")
        wrapper.find('textarea').simulate('change', { target: {value: "2"} })
        expect(wrapper.find('textarea').text()).toBe("2")
    });

    test("Cell locked", () => {
        const wrapper = mount(<Cell
            index={3}
            value={"6"}
            onChange={(index:number, value:string) => {}}
            lock={true}
          />)
        expect(wrapper.find('textarea').text()).toBe("6")
        wrapper.find('textarea').simulate('change', { target: {value: "2"} })
        expect(wrapper.find('textarea').text()).toBe("6")
    });

    test("Cell wrong value", () => {
        const wrapper = mount(<Cell
            index={3}
            value={"6"}
            onChange={(index:number, value:string) => {}}
            lock={false}
          />)
        expect(wrapper.find('textarea').text()).toBe("6")
        wrapper.find('textarea').simulate('change', { target: {value: "0"} })
        expect(wrapper.find('textarea').text()).toBe("6")
        wrapper.find('textarea').simulate('change', { target: {value: "10"} })
        expect(wrapper.find('textarea').text()).toBe("6")
        wrapper.find('textarea').simulate('change', { target: {value: "1.1"} })
        expect(wrapper.find('textarea').text()).toBe("6")
        wrapper.find('textarea').simulate('change', { target: {value: "abc"} })
        expect(wrapper.find('textarea').text()).toBe("6")
    });
});
