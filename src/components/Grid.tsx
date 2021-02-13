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
    cells: any, //[value, modifiable, error]
    isConnected: boolean,
    finished: boolean
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps, IGridState> {
    timerID!: NodeJS.Timeout;
    cellsDeco: any;

    constructor(props: any) {
        super(props);
        let cells = new Array(81).fill(null).map(()=>(["", false, false]));
        this.cellsDeco = new Array(81).fill(null);
        this.state = {
            cells: cells,
            isConnected: true,
            finished: false
        };
    }

    /**
     * Called after the component is rendered.
     * It set a timer to refresh cells values.
     */
    componentDidMount() {
        this.timerID = setInterval(
            () => this.updateGrid(),
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
     * Update cells values from C-Client.
     */
    updateGrid() {
        let cells = this.state.cells;
        if (!this.state.isConnected) {
            console.error("updateGrid() called while not connected.")
            return cells;
        }
        this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
            let itBoolean = this.props.mvmap.iteratorBoolean()
            let itString = this.props.mvmap.iteratorString()
            while(itBoolean.hasNext()) {
                let val = itBoolean.next()
                cells[val.first][1] = val.second.iterator().next()
            }
            while(itString.hasNext()) {
                let val = itString.next()
                cells[val.first][0] = hashSetToString(val.second)
            }
        })
        this.checkGrid(cells)
    }

    /**
     * This function is used to simulate the offline mode.
     */
    switchConnection() {
        if (this.state.isConnected) {
            this.cellsDeco = new Array(81).fill(null);
            clearInterval(this.timerID);
        } else {
            this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
                for (let i = 0; i < 81; i++) {
                    if (this.cellsDeco[i]!==null) {
                        this.props.mvmap.setString(i, this.cellsDeco[i]);
                    }
                }
            })
            this.timerID = setInterval(
                () => this.updateGrid(),
                1000
            );
        }
        this.setState({isConnected: !this.state.isConnected})
    }

    /**
     * Set the MVMap with the given values.
     * @param values values to be set in the MVMap.
     */
    initFrom(values:any) {
        assert.ok(values.length === 81);
        let cells = this.state.cells;
        for (let i = 0; i < 81; i++) {
            cells[i][0] = values[i] === "." ? "" : values[i];
            cells[i][1] = values[i] === "." ? true : false;
            if (this.state.isConnected) {
                this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
                    this.props.mvmap.setString(i, cells[i][0]);
                    this.props.mvmap.setBoolean(i, cells[i][1]);
                })
            } else {
                this.cellsDeco[i] = values[i];
            }
        }
        this.checkGrid(cells)
    }

    /**
     * This handler is called when the value of a cell is changed.
     * @param index The index of the cell changed.
     * @param value The new value of the cell.
     */
    handleChange(index: number, value: string) {
        assert.ok(value === "" || (Number(value) >= 1 && Number(value) <= 9))
        assert.ok(index >= 0 && index < 81)
        
        let cells = this.state.cells;
        cells[index][0] = value;
        this.cellsDeco[index] = value;
        this.checkGrid(cells);
        
        if (this.state.isConnected) {
            this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
                this.props.mvmap.setString(index, value);
            })
        }
    }

    /**
     * This function return a React element corresponding to a cell.
     * @param index The index of the cell to render.
     */
    renderCell(index: number) {
        assert.ok(index >= 0 && index < 81)
        let [value, modifiable, error] = this.state.cells[index];
        return (
            <Cell
                index={index}
                value={value}
                modifiable={modifiable}
                onChange={(index:number, value:string) => this.handleChange(index, value)}
                error={error}
            />
        );
    }

    /**
     * This function return a React element corresponding to a block of cell.
     * @param blockNum The index of the block to render.
     */
    renderBlock(blockNum: number) {
        assert.ok(blockNum >= 0 && blockNum < 9)
        let index = blockIndex(blockNum);
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
        return (
            <div className="sudoku">
                <div><button onClick={this.initFrom.bind(this, generateStaticGrid())}>Reset</button></div><br />
                <div><button onClick={() => this.switchConnection()}>{this.state.isConnected ? "Disconnect" : "Connect"}</button></div><br />
                <table className="grid">
                    <tbody>
                        {[0, 1, 2].map((line) =>
                            <tr key={line.toString()}>
                                {this.renderBlock(line * 3)}
                                {this.renderBlock(line * 3 + 1)}
                                {this.renderBlock(line * 3 + 2)}
                            </tr>
                        )}
                    </tbody>
                </table>
                {this.state.finished && <h2 className="status" id="status">Sudoku completed</h2>}
            </div>
        );
    }

    /**
     * Check if a line respect Sudoku lines rules.
     * @param line The line number to be checked.
     */
    checkLine(line: number) {
        assert.ok(line >= 0 && line < 9)
        let cpt = Array(9).fill(0)
        for (let column = 0; column < 9; column++) {
            let index = line * 9 + column
            let val = this.state.cells[index][0]
            if (val.length === 0 || val.length > 1) {
                continue
            }
            cpt[Number(val)-1]++
        }
        return cpt.every((c) => c <= 1)
    }

    /**
     * Check if a column respect Sudoku columns rules.
     * @param col The column number to be checked.
     */
    checkColumn(column: number) {
        assert.ok(column >= 0 && column < 9)
        let cpt = Array(9).fill(0)
        for (let line = 0; line < 9; line++) {
            let index = line * 9 + column
            let val = this.state.cells[index][0]
            if (val.length === 0 || val.length > 1) {
                continue
            }
            cpt[Number(val)-1]++
        }
        return cpt.every((c) => c <= 1)
    }

    /**
     * Check if a block respect Sudoku blocks rules.
     * @param block The block number to be checked.
     */
    checkBlock(block: number) {
        assert.ok(block >= 0 && block < 9)
        let cpt = Array(9).fill(0)
        let indexList = blockIndex(block)
        for (let index of indexList) {
            let val = this.state.cells[index][0]
            if (val.length === 0 || val.length > 1) {
                continue
            }
            cpt[Number(val)-1]++
        }
        return cpt.every((c) => c <= 1)
    }

    /**
     * This function check if all lines respect Sudoku lines rules.
     */
    checkLines() {
        let indexList = []
        for (let line = 0; line < 9; line++) {
            if (this.checkLine(line) === false) {
                for (let i = 0; i < 9; i++) {
                    indexList.push(line * 9 + i)
                }
            }
        }
        return indexList
    }

    /**
     * This function check if all columns respect Sudoku columns rules.
     */
    checkColumns() {
        let indexList = []
        for (let column = 0; column < 9; column++) {
            if (this.checkColumn(column) === false) {
                for (let i = 0; i < 9; i++) {
                    indexList.push(i * 9 + column)
                }
            }
        }
        return indexList
    }

    /**
     * This function check if all blocks respect Sudoku blocks rules.
     */
    checkBlocks() {
        let indexList : number[] = []
        for (let block = 0; block < 9; block++) {
            if (this.checkBlock(block) === false) {
                indexList = indexList.concat(blockIndex(block));
            }
        }
        return indexList
    }

    /**
     * This function check if cells contains multiple values.
     */
    checkCells() {
        let indexList = []
        for (let cell = 0; cell < 81; cell++) {
            let val = this.state.cells[cell][0]
            if (val.length > 1) {
                indexList.push(cell)
            }
        }
        return indexList
    }

    /**
     * This function check if all cells respect Sudoku rules.
     */
    checkGrid(cells: any) {
        let errorIndexList = this.checkLines();
        errorIndexList = errorIndexList.concat(this.checkColumns());
        errorIndexList = errorIndexList.concat(this.checkBlocks());
        errorIndexList = errorIndexList.concat(this.checkCells());
        this.setErrorCell(errorIndexList, cells);
    }

    /**
     * Update cell to say if there is an error.
     * @param errorIndexList List of cells containing an error input.
     * @param cells Current value of cells.
     */
    setErrorCell(errorIndexList: any, cells: any) {
        errorIndexList = new Set(errorIndexList)
        for (let index = 0; index < 81; index++) {
            if (errorIndexList.has(index)) {
                cells[index][2] = true;
            } else {
                cells[index][2] = false;
            }
        }

        if (errorIndexList.size) {
            this.setState({cells: cells, finished: false});
            return
        }

        const regex = /^[1-9]$/
        for (let index = 0; index < 81; index++) {
            if (!regex.test(this.state.cells[index][0])) {
                this.setState({cells: cells, finished: false});
                return
            }
        }
        this.setState({cells: cells, finished: true})
    }
}

/**
 * Return a predefined Sudoku grid as a string.
 */
function generateStaticGrid() {
    /**
     * 32.17.654
     * 6152947..
     * .783.6291
     * .574.2816
     * 18.7659.2
     * 236.1.54.
     * 742.813.9
     * 8.36.7125
     * 56.9234.8
     */
    const values = "32.17.6546152947...783.6291.574.281618.7659.2236.1.54.742.813.98.36.712556.9234.8"
    assert.ok(values.split('').every(x => (x === "." || (Number(x) >= 1 && Number(x) <= 9))));
    return values;
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
function blockIndex(block: number) {
    assert.ok(block >= 0 && block < 9)
    let line = Math.floor(block / 3) * 3
    let col = (block % 3) * 3
    let index = [ line      * 9 + col,   line      * 9 + col + 1,  line      * 9 + col + 2,
                 (line + 1) * 9 + col,  (line + 1) * 9 + col + 1, (line + 1) * 9 + col + 2,
                 (line + 2) * 9 + col,  (line + 2) * 9 + col + 1, (line + 2) * 9 + col + 2]
    return index
}

/**
 * Concatenates all values of a HashSet as a String.
 * @param set HashSet to be concatenated.
 */
function hashSetToString(set: any) {
    let res = new Set();
    let it = set.iterator();
    while (it.hasNext()) {
        let val = it.next();
        if (val !== "") {
            res.add(val);
        }
    }
    return Array.from(res).sort().join(' ')
}

export default Grid
