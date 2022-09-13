import React from "react";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";
import Cell from "./Cell";

configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => ({}));
});

describe("Testing UI", () => {
  /**
   * This test evaluates that the cell displays the value.
   * Here it should display 6.
   */
  test("Cell value", () => {
    const wrapper = mount(
      <Cell index={3} value={"6"} onChange={() => ({})} error={false} />
    );
    const input = wrapper.find("input");
    expect(input.instance().value).toBe("6");
  });
});
