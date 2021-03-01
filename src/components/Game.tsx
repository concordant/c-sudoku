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
import Grid from './Grid';
import { client } from '@concordant/c-client';

/**
 * Interface for the state of a Game.
 * Keep a reference to the opened session and opened MVMap.
 */
interface IGameState {
    session: any,
    collection: any
}

/**
 * This class represent the Game that glues all components together.
 */
class Game extends React.Component<{}, IGameState> {
    constructor(props: any) {
        super(props);
        let CONFIG = require('../config.json');
        let session = client.Session.Companion.connect(CONFIG.dbName, CONFIG.serviceUrl, CONFIG.credentials);
        let collection = session.openCollection("sudoku", false);
        this.state = {
            session: session,
            collection: collection
        }
    }

    render() {
        return (
            <Grid session={this.state.session} collection={this.state.collection} />
        );
    }
}

export default Game
