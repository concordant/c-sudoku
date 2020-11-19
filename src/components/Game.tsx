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

/**
 * This class represent the Game that glues all components together.
 */
class Game extends React.Component {
    generateInitialGrid(){
      const initVal = ["6","","2","3","8","7","9","1","4",
                      "7","1","9","4","5","2","3","6","8",
                      "3","4","8","1","9","6","2","5","7",
                      "8","2","1","9","3","5","4","7","6",
                      "5","9","6","2","7","4","8","3","1",
                      "4","7","3","8","6","1","5","2","9",
                      "1","8","7","5","2","9","","","3",
                      "2","3","4","6","1","8","7","9","5",
                      "","6","5","7","4","3","1","8","2"]
      assert.ok(initVal.every(x => (x==="" || Number(x)>=1)))
      assert.ok(initVal.every(x => Number(x)<=9))
      return initVal
    }

    render() {
      return (
        <div className="game">
          <div className="game-grid">
            <Grid 
                initial = {this.generateInitialGrid()}
            />
          </div><br />
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

export default Game
