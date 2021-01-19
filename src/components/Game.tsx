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
import Grid from './Grid';
import { client } from '@concordant/c-client';

/**
 * Interface for the state of a Game.
 * Keep a reference to the opened session and opened MVMap.
 */
interface IGameState {
    session: any,
    mvmap: any
}

/**
 * This class represent the Game that glues all components together.
 */
class Game extends React.Component<{}, IGameState> {
    constructor(props: any) {
        super(props);
        let session = client.Session.Companion.connect("sudoku", "credentials");
        let collection = session.openCollection("sudokuCollection", false);
        let mvmap = collection.open("sudokuGrid", "MVMap", false, function () {return});
        this.state = {
            session: session,
            mvmap: mvmap
        };
    }

    /**
     * Return a predefined Sudoku grid as an array.
     */
    generateStaticGrid() {
        const values = ["6", "", "2", "3", "8", "7", "9", "1", "4",
                        "7", "1", "9", "4", "5", "2", "3", "6", "8",
                        "3", "4", "8", "1", "9", "6", "2", "5", "7",
                        "8", "2", "1", "9", "3", "5", "4", "7", "6",
                        "5", "9", "", "2", "7", "4", "8", "3", "1",
                        "4", "7", "3", "8", "6", "1", "5", "2", "9",
                        "1", "8", "7", "5", "2", "9", "", "", "3",
                        "2", "3", "4", "6", "1", "8", "7", "9", "5",
                        "", "6", "5", "7", "4", "3", "1", "8", "2"];
        assert.ok(values.every(x => (x==="" || (Number(x)>=1 && Number(x)<=9))));
        return values;
    }

    /**
     * Set the MVMap with the given values.
     * @param values to be set in the MVMap.
     */
    setMVMap(values:any) {
        this.state.session.transaction(client.utils.ConsistencyLevel.RC, () => {
            for (let i = 0; i < 81; i++) {
                this.state.mvmap.setString("cell" + i, values[i]);
                if (values[i] === "") {
                    this.state.mvmap.setBoolean("cell" + i, true);
                } else {
                    this.state.mvmap.setBoolean("cell" + i, false);
                }
            }
        })
    }

    render() {
        return (
            <div className="game">
                <div><button onClick={this.setMVMap.bind(this, this.generateStaticGrid())}>Reset</button></div>
                <div className="game-grid">
                <Grid session={this.state.session} mvmap={this.state.mvmap}/>
                </div><br />
            </div>
        );
    }
}

export default Game
