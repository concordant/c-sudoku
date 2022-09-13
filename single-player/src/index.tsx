import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Game from "./components/Game";
import Header from "./components/Header";

ReactDOM.render(
  <div>
    <Header />
    <Game />
    <div className="padding">
      <p className="footer">© CONCORDANT 2021.</p>
    </div>
  </div>,
  document.getElementById("root")
);
