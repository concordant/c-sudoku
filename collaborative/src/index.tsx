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
