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
import assert from 'assert';
import Cell from './Cell';
import * as GridUtils from './GridUtils';
import { client } from '@concordant/c-client';

/**
 * Interface for the properties of the Grid
 */
interface IGridProps {
    session: any,
    mvmap: any
}

/**
 * Interface for the state of the Grid
 */
interface IGridState {
    cells: any
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps, IGridState> {
    timerID!: NodeJS.Timeout;

    constructor(props: any) {
        super(props);
        let cells = new Array(81).fill(null).map(()=>(["", false].slice()));
        this.state = {
            cells: cells
        };
    }

    /**
     * Called after the component is rendered.
     * It set a timer to refresh cells values.
     */
    componentDidMount() {
        this.timerID = setInterval(
            () => this.setState({cells: this.updateCells()}),
            1000
        );
    }

    /**
     * Called when the compenent is about to be removed from the DOM.
     * It remove the timer set in componentDidMount().
     */
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    /**
     * Concatenates all values of a Set as a String.
     * @param set Set to be concatenated.
     */
    setToString(set: any) {
        let res = new Set();
        let it = set.iterator();
        while (it.hasNext()) {
            res.add(it.next());
        }
        return Array.from(res).join(' ')
    }

    /**
     * Update cells values.
     */
    updateCells() {
        let cells = this.state.cells;
        this.props.session.transaction(client.utils.ConsistencyLevel.RC, () => {
            let itString = this.props.mvmap.iteratorString()
            let itBoolean = this.props.mvmap.iteratorBoolean()

            while(itString.hasNext()) {
                let val = itString.next()
                cells[val.first.replace('cell','')][0] = this.setToString(val.second)
            }
            while(itBoolean.hasNext()) {
                let val = itBoolean.next()
                cells[val.first.replace('cell','')][1] = val.second.iterator().next()
            }
        })
        return cells
    }

    /**
     * This handler is called when the value of a cell is changed.
     * @param index The index of the cell changed.
     * @param value The new value of the cell.
     */
    handleChange(index:number , value:string) {
        assert.ok(value === "" || (Number(value) >= 1 && Number(value) <= 9))
        assert.ok(index >= 0 && index < 81)
        
        let cells = this.state.cells;
        cells[index][0] = value;
        this.setState({cells:cells});

        this.props.session.transaction(client.utils.ConsistencyLevel.RC, () => {
            this.props.mvmap.setString("cell"+index, value);
        })
        
    }

    /**
     * This function return a React element corresponding to a cell.
     * @param index The index of the cell to render.
     */
    renderCell(index: number) {
        assert.ok(index >= 0 && index < 81)

        let value = this.state.cells[index][0]
        let modifiable = this.state.cells[index][1]

        return (
            <Cell
                index={index}
                value={value}
                modifiable={modifiable}
                onChange={(index:number, value:string) => this.handleChange(index, value)}
            />
        );
    }

    /**
     * This function return a React element corresponding to a block of cell.
     * @param blockNum The index of the block to render.
     */
    renderBlock(blockNum: number) {
        assert.ok(blockNum >= 0 && blockNum < 9)
        let index = GridUtils.blockIndex(blockNum)
        return (
            <td>
                {this.renderCell(index[0])}{this.renderCell(index[1])}{this.renderCell(index[2])}<br />
                {this.renderCell(index[3])}{this.renderCell(index[4])}{this.renderCell(index[5])}<br />
                {this.renderCell(index[6])}{this.renderCell(index[7])}{this.renderCell(index[8])}
            </td>
        )
    }

    /**
     * The function is called when the grid is updated. It return a React element corresponding to the grid of the Sudoku.
     */
    render() {
        const status = "Status : " + this.validateSudoku();
        return (
            <div className="sudokuTable">
                <table>
                <tbody>
                    <tr>
                    {this.renderBlock(0)}{this.renderBlock(1)}{this.renderBlock(2)}      
                    </tr>
                    <tr>
                    {this.renderBlock(3)}{this.renderBlock(4)}{this.renderBlock(5)}      
                    </tr>
                    <tr>
                    {this.renderBlock(6)}{this.renderBlock(7)}{this.renderBlock(8)}      
                    </tr>
                </tbody>
                </table>
                <div className="status" id="status">{status}</div>
            </div>
        );
    }

    /**
     * Check if a line respect Sudoku lines rules.
     * @param line The line number to be checked.
     */
    checkLine(line:number) {
        assert.ok(line >= 0 && line < 9)
        let check = Array(9).fill(0)
        for (let col = 0; col < 9; col++) {
            let index = line*9+col
            let val = this.state.cells[index][0]
            if (val.length === 0 || val.length > 1) {
                continue
            }
            check[Number(val)-1]++
        }
        return GridUtils.checkArray(check)
    }

    /**
     * Check if a column respect Sudoku columns rules.
     * @param col The column number to be checked.
     */
    checkColumn(col:number) {
        assert.ok(col >= 0 && col < 9)
        let check = Array(9).fill(0)
        for (let line = 0; line < 9; line++) {
            let index = line*9+col
            let val = this.state.cells[index][0]
            if (val.length === 0 || val.length > 1) {
                continue
            }
            check[Number(val)-1]++
        }
        return GridUtils.checkArray(check)
    }

    /**
     * Check if a block respect Sudoku blocks rules.
     * @param block The block number to be checked.
     */
    checkBlock(block:number) {
        assert.ok(block >= 0 && block < 9)
        let check = Array(9).fill(0)
        let listIndex = GridUtils.blockIndex(block)
        for (let index of listIndex) {
            let val = this.state.cells[index][0]
            if (val.length === 0 || val.length > 1) {
                continue
            }
            check[Number(val)-1]++
        }
        return GridUtils.checkArray(check)
    }

    /**
     * This function check if all lines respect Sudoku lines rules.
     */
    validateLine() {
        let error = ""
        for (let line = 0; line < 9; line++) {
            if (this.checkLine(line) === false) {
                error += "Erreur ligne "+ (line + 1).toString()+" "
                let listIndex = []
                for (let i = 0; i < 9; i++) {
                    listIndex.push(line * 9 + i)
                }
                GridUtils.setErrorCell(listIndex)
            }
        }
        if (error) {
            // console.error(error)
            return false
        }
        return true
    }

    /**
     * This function check if all columns respect Sudoku columns rules.
     */
    validateColumn() {
        let error = ""
        for (let col = 0; col < 9; col++) {
            if (this.checkColumn(col) === false) {
                error += "Erreur colonne "+ (col+1).toString()+" "
                let listIndex = []
                for (let i = 0; i < 9; i++) {
                    listIndex.push(i*9+col)
                }
                GridUtils.setErrorCell(listIndex)
            }
        }
        if (error) {
            // console.error(error)
            return false
        }
        return true
    }

    /**
     * This function check if all blocks respect Sudoku blocks rules.
     */
    validateBlock() {
        let error = ""
        for (let block = 0; block < 9; block++) {
            if (this.checkBlock(block) === false) {
                error += "Erreur block "+ (block+1).toString()+" "
                let listIndex = GridUtils.blockIndex(block)
                GridUtils.setErrorCell(listIndex)
            }
        }
        if (error) {
            // console.error(error)
            return false
        }
        return true
    }

    /**
     * This function check if all cells respect Sudoku rules.
     */
    validateSudoku() {
        let listIndex = []
        for (let i = 0; i < 81; i++) {
            listIndex.push(i)
        }
        GridUtils.removeErrorCell(listIndex)

        let error = ""
        if (!this.validateLine()) {
            error = "Error"
        }
        if (!this.validateColumn()) {
            error = "Error"
        }
        if (!this.validateBlock()) {
            error = "Error"
        }

        if (error) {
            return error
        }
        
        const regex = /^[1-9]$/
        for (let index = 0; index < 81; index++) {
            if (!regex.test(this.state.cells[index][0])) {
                return "Continue"
            }
        }
        return "Complete"
    }
}

export default Grid
