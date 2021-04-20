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
import ReactDOM from "react-dom";
import "./index.css";
import Game from "./components/Game";
import Header from "./components/Header";

ReactDOM.render(
  <div>
    <Header />
    <div className="intro reduceWidth">
      <p>
        Sudoku is a basic example of a collaborative multi-player game. You can
        create multiple instances of the same Sudoku grid, and solve it
        collaboratively. When one user fills a square, the others observe the
        update, and can correct it if they wish. If two users fill the same
        square at the same time, both updates are retained, until one of the
        users imposes a new value. A user can disconnect and work in isolation;
        when he/she reconnects, his/her updates are merged into the shared grid.
        Switching between connected/disconnected modes is seamless: the
        application continues to work without a hitch and without any loss of
        data.
      </p>
      <p>The Sudoku application is based upon the Concordant MVMap CRDT.</p>
    </div>
    <Game />
    <div className="padding">
      <p className="footer">© CONCORDANT 2021.</p>
    </div>
  </div>,
  document.getElementById("root")
);
