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

import React from 'react';
import { validInput } from '../constants'

/**
 * Interface for the properties of the Cell.
 * The Cell needs to know his index in the grid, his value, a callback function
 * used when the value is modified and if we are allowed to modify the value.
 */
interface ICellProps {
    index: number,
    value: string,
    onChange: any,
    error: boolean
}

/**
 * This class represent a cell of the Sudoku
 */
class Cell extends React.Component<ICellProps, {}> {
    /**
     * onChange event handler
     * @param event handled
     */
    onChange(event: any) {
        if (event.target.value === "" || validInput.test(event.target.value)) {
            this.props.onChange(this.props.index, event.target.value)
        } else {
            console.error("Invalid input in cell " + this.props.index + " : " + event.target.value)
        }
    }

    render() {
        let cellClass = ""
        if (this.props.value.length > 1) {
            cellClass += "mv "
        }
        if (this.props.onChange === null) {
            cellClass += "locked "
        }
        if (this.props.error){
            cellClass += "wrongvalue "
        }
        return (
            <input
                id={String(this.props.index)}
                className={cellClass}
                maxLength={1}
                value={this.props.value}
                onChange={this.props.onChange ? (event) => this.onChange(event) : function() { }}
                readOnly={this.props.onChange === null}
            />
        );
    }
}

export default Cell
