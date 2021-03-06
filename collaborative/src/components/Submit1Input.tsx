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

interface ISubmit1InputProps {
  onSubmit: (docName: string) => void;
  inputName: string;
}

interface ISubmit1InputState {
  value: string;
}

class Submit1Input extends React.Component<
  ISubmit1InputProps,
  ISubmit1InputState
> {
  constructor(props: ISubmit1InputProps) {
    super(props);
    this.state = { value: "1" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * onChange event handler
   * @param event handled
   */
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (Number(this.state.value) >= 1 && Number(this.state.value) <= 100) {
      this.props.onSubmit(this.state.value);
    }
  }

  render(): JSX.Element {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.inputName} :
          <input
            type="number"
            value={this.state.value}
            onChange={this.handleChange}
            min="1"
            max="100"
          />
        </label>
        <input type="submit" value={"Change " + this.props.inputName} />
      </form>
    );
  }
}

export default Submit1Input;
