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
import { validInput } from './Cell';
import { client } from '@concordant/c-client';
import Submit1Input from './Submit1Input';

/**
 * Interface for the properties of the Grid
 */
interface IGridProps {
    session: any,
    collection: any
}

/**
 * Interface for the state of the Grid
 */
interface IGridState {
    gridNum: string,
    mvmap: any,
    cells: {value: string, modifiable: boolean, error: boolean}[],
    isConnected: boolean,
    isFinished: boolean
}

/**
 * This class represent the grid of the Sudoku
 */
class Grid extends React.Component<IGridProps, IGridState> {
    timerID!: NodeJS.Timeout;
    modifiedCells: string[];

    constructor(props: any) {
        super(props);
        let cells = new Array(81).fill(null).map(()=>({value:"", modifiable:false, error:false}));
        this.modifiedCells = new Array(81).fill(null);
        let gridNum = "1";
        let mvmap = this.props.collection.open("grid" + gridNum, "MVMap", false, function () {return});
        this.state = {
            gridNum: gridNum,
            mvmap: mvmap,
            cells: cells,
            isConnected: true,
            isFinished: false
        };
    }

    /**
     * Called after the component is rendered.
     * It set a timer to refresh cells values.
     */
    componentDidMount() {
        this.initFrom(generateStaticGrid(this.state.gridNum));
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
        for (let index = 0; index < 81; index++) {
            if (cells[index].modifiable) {
                cells[index].value = "";
            }
        }
        this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
            let itString = this.state.mvmap.iteratorString()
            while(itString.hasNext()) {
                let val = itString.next()
                cells[val.first].value = hashSetToString(val.second)
            }
        })
        this.updateState(cells)
    }

    /**
     * This function is used to simulate the offline mode.
     */
    switchConnection() {
        if (this.state.isConnected) {
            this.modifiedCells = new Array(81).fill(null);
            clearInterval(this.timerID);
        } else {
            for (let index = 0; index < 81; index++) {
                if (this.state.cells[index].modifiable && this.modifiedCells[index] !== null) {
                    this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
                        this.state.mvmap.setString(index, this.modifiedCells[index]);
                    })
                }
            }
            this.timerID = setInterval(
                () => this.updateGrid(),
                1000
            );
        }
        this.setState({isConnected: !this.state.isConnected})
    }

    /**
     * Initialize the grid with the given values.
     * @param values values to be set in the grid.
     */
    initFrom(values:any) {
        assert.ok(values.length === 81);
        let cells = this.state.cells;
        for (let index = 0; index < 81; index++) {
            cells[index].value = values[index] === "." ? "" : values[index];
            cells[index].modifiable = values[index] === "." ? true : false;
        }
        this.updateState(cells)
    }

    /**
     * Reset the value of all modifiable cells.
     */
    reset() {
        let cells = this.state.cells;
        for (let index = 0; index < 81; index++) {
            if (cells[index].modifiable) {
                cells[index].value = "";
                if (this.state.isConnected) {
                    this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
                        this.state.mvmap.setString(index, cells[index].value);
                    })
                } else {
                    this.modifiedCells[index] = "";
                }
            }
        }
        this.updateState(cells)
    }

    /**
     * This handler is called when the value of a cell is changed.
     * @param index The index of the cell changed.
     * @param value The new value of the cell.
     */
    handleChange(index: number, value: string) {
        assert.ok(value === "" || (Number(value) >= 1 && Number(value) <= 9))
        assert.ok(index >= 0 && index < 81)
        if (!this.state.cells[index].modifiable) {
            console.error("Trying to change an non modifiable cell. Should not happend");
        }

        let cells = this.state.cells;
        cells[index].value = value;
        this.updateState(cells);
        
        if (this.state.isConnected) {
            this.props.session.transaction(client.utils.ConsistencyLevel.None, () => {
                this.state.mvmap.setString(index, value);
            })
        } else {
            this.modifiedCells[index] = value;
        }
    }

    /**
     * This handler is called when a new grid number is submit.
     * @param gridNum Desired grid number.
     */
    handleSubmit(gridNum: string) {
        if (Number(gridNum) < 1 || Number(gridNum) > 46 || gridNum === this.state.gridNum) {
            return;
        }
        let mvmap = this.props.collection.open("grid" + gridNum, "MVMap", false, function () {return});
        this.setState({gridNum: gridNum, mvmap: mvmap});
        this.initFrom(generateStaticGrid(gridNum));
    }

    /**
     * This function return a React element corresponding to a cell.
     * @param index The index of the cell to render.
     */
    renderCell(index: number) {
        assert.ok(index >= 0 && index < 81)
        return (
            <Cell
                index={index}
                value={this.state.cells[index].value}
                onChange={this.state.cells[index].modifiable ? (index:number, value:string) => this.handleChange(index, value) : null}
                error={this.state.cells[index].error}
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
                <div>Current grid : {this.state.gridNum}</div>
                <Submit1Input inputName="Grid" onSubmit={this.handleSubmit.bind(this)} />
                <div>Grid difficulty on scale of 1-46 (1 being the easier and 46 being the harder)</div>
                <br />
                <div><button onClick={this.reset.bind(this)}>Reset</button></div><br />
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
                {this.state.isFinished && <h2 className="status" id="status">Sudoku completed</h2>}
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
            let val = this.state.cells[index].value
            if (val.length === 0 || val.length > 1) {
                continue
            }
            cpt[Number(val)-1]++
        }
        return cpt.every((c) => c <= 1)
    }

    /**
     * Check if a column respect Sudoku columns rules.
     * @param column The column number to be checked.
     */
    checkColumn(column: number) {
        assert.ok(column >= 0 && column < 9)
        let cpt = Array(9).fill(0)
        for (let line = 0; line < 9; line++) {
            let index = line * 9 + column
            let val = this.state.cells[index].value
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
            let val = this.state.cells[index].value
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
                for (let column = 0; column < 9; column++) {
                    indexList.push(line * 9 + column)
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
                for (let line = 0; line < 9; line++) {
                    indexList.push(line * 9 + column)
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
            let val = this.state.cells[cell].value
            if (val.length > 1) {
                indexList.push(cell)
            }
        }
        return indexList
    }

    /**
     * Check if all cells respect Sudoku rules and update cells.
     * @param cells Current cells values.
     */
    updateState(cells: any) {
        let errorIndexList = this.checkLines();
        errorIndexList = errorIndexList.concat(this.checkColumns());
        errorIndexList = errorIndexList.concat(this.checkBlocks());
        errorIndexList = errorIndexList.concat(this.checkCells());

        let errorIndexSet = new Set(errorIndexList);

        for (let index = 0; index < 81; index++) {
            if (errorIndexSet.has(index)) {
                cells[index].error = true;
            } else {
                cells[index].error = false;
            }
        }

        if (errorIndexSet.size) {
            this.setState({cells: cells, isFinished: false});
            return
        }

        for (let index = 0; index < 81; index++) {
            if (!validInput.test(this.state.cells[index].value)) {
                this.setState({cells: cells, isFinished: false});
                return
            }
        }
        this.setState({cells: cells, isFinished: true})
    }
}

/**
 * Grids generated using sudokutoolcollection.
 * https://www.npmjs.com/package/sudokutoolcollection
 */
const GRIDS : {[key: string]: string} = {
    "1": "8354.721.4293.17..1675298437826.4.51514.32.76.9617...8..8..6132271..3684643218597",
    "2": "..6.2.74..42.7..86175486293538694172..185743.4973128657192683548.4.3..27..374..18",
    "3": "31.29.864...31.79292..481.58649.157315....928792..3641539...216678132459241..9387",
    "4": ".962.8.7.314657928.8.9.45164...25.6976.4932819281...5.8723.16951495.283765378....",
    "5": "42.8.713585.31.247.312548969176483523.8....1.2.51.3...592731...67348592.1.49..573",
    "6": "18.43.79.56.792..4.9.581263871.54.36.5..7...132..19..7235148679948367..2.1.925348",
    "7": ".5.9416731..786925...53214842.6.378.3..8.7462...2.453....1653945..4298179..378256",
    "8": "2.9756.48548.9..76..7.84529873529614124637.859..4182377...4.86.4...6375.....7.49.",
    "9": ".862.9.3437..462.94..35167.853762491...5138.7...984365.67.98..3938125746...63....",
    "10": "1..9.3765...5..19339.7168246398542..7526314894812795365.31.794....4..3.....3..6..",
    "11": "..617.29519263547857428.163258..3.1.613...58494751832.4.5..1.3.7.9.4..51..1......",
    "12": ".3.7.14.9..136.....24895.6..97.43.5..45186..78639..124.125..6936.94.251835...9742",
    "13": "578316924..3542817421789.5...5..7468286134579...865231.....8.4...2....8.8......92",
    "14": "795362.8.164978...283145..98412.7..6..68.4...9.2651..8.17.83.....9.26.17.28719...",
    "15": "691..5...2351.9....8..2.59116.2.8.5.523...1..4785136298.2...9..9468327153.7...28.",
    "16": ".4.8.9....8.514......3.7.4.....46.2.834295.......38.94519673482376482951428951...",
    "17": "2..9134..4.9.56...1...48....4..9.....1..3..4.9..184526351.69.72628375194794821...",
    "18": "4265318977..942...1958764.3..7195...612784.35954263178.4.....89..................",
    "19": ".31487259.8.3..41..4....8738935..647.7.94..2.124.7.395.......32.69...581.1.....64",
    "20": "254986..7...1459.2169732....9.461....1...7.4342.358.91.71.2.............9428.35.6",
    "21": ".8.3.....57....81..2.87....295438671164957382738.62594942.8.1...5........1.......",
    "22": ".4..8.....18.3..9..6........5.86732.327195...68.3427..89...36.2.769285..23.6.49..",
    "23": "923..8.6..68..4.7...76.928383...2.5.295..184.74...5.2.61...75..38...67.257.......",
    "24": "........77.9.63.8....7.89..53.87.649....3.1288.....375...6.92..916327854......796",
    "25": "2..496.5336957124.....3...9......521.1..254.6...61.38.....42..5..48....2...1.7.34",
    "26": "1.279.5....6.........8.....671924385358167...429385....9....4...6.....5..146.9..3",
    "27": ".....9.6..7.3..48........3.......84.469.38.7281...4.9......1.2.146..3.5.298675314",
    "28": "4.3895.21...6123.4.1.374.85...7.8246.2..6.517....21.39............2......3......2",
    "29": ".819462.5.9.7384164.621........9256.6..45.....5..67.....8.....1.2.6.1.9..........",
    "30": ".2398..5....453...549.7....3..7958..854.1.......348..5.758.41...3.5...........5..",
    "31": "284..7...7..8.2......4.18.......5........4........97..675..8...8927.31561.35269..",
    "32": "....9..........8..14...2..7.95..7.....2.......81....65916875324874........3..9678",
    "33": "5...1..8..7....9..............165823162...579385792......6...5..3.52..9..5.......",
    "34": "....4.7.17.....5....2...38....4..21..2.....4...1....3.1.6..4..92....81.3839..547.",
    "35": "698..4...1..5...4.574..3.2.4.5...7..96.....8.2873...1.3...96...7........8........",
    "36": "...389..7..5761..47..542.......5.........34...........3.6.........8.5.464871.6...",
    "37": ".5....3.6.7....491.......5..4...7..9.8....6..21.8.5734...3...6....6........9...43",
    "38": "2936.8415...4.37......2.6.........3................8......673..748.15.........5.1",
    "39": ".23.....9.6....2...8.......65........7..6...214.............9..........6296458731",
    "40": "..845.6.26....75.4.5...29............16..572.............5........3..2......29.5.",
    "41": "..8.............4........5............43.6.87...............5.1...5.48.928579.634",
    "42": "...7.4.81............5....2..3..51.8.1...........1.....7......52.6.....9.....7316",
    "43": "......9.....9....2.93.2.54..1.....65.........7.....2.....8..........38..987.1....",
    "44": "......4.1......2........9.8......6.3.5.9.71.2.2...4....71....2....8......9.......",
    "45": "....6.9..56....7..........6...348.7...4...8..........4....97....15..4............",
    "46": "9.....7....5...6.8..8...2..2....6...6.....4.....4..3........5.2........3..2......"
}

/**
 * Return a predefined Sudoku grid as a string.
 * @param gridNum Desired grid number
 */
function generateStaticGrid(gridNum: string) {
    return GRIDS[gridNum];
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
function blockIndex(block: number) {
    assert.ok(block >= 0 && block < 9)
    let line = Math.floor(block / 3) * 3
    let column = (block % 3) * 3
    let index = [ line      * 9 + column,   line      * 9 + column + 1,  line      * 9 + column + 2,
                 (line + 1) * 9 + column,  (line + 1) * 9 + column + 1, (line + 1) * 9 + column + 2,
                 (line + 2) * 9 + column,  (line + 2) * 9 + column + 1, (line + 2) * 9 + column + 2]
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
