import React from "react";

/**
 * This class represent the header of the site.
 */
class Header extends React.Component {
  render(): JSX.Element {
    return (
      <div className="title background-turquoise padding">
        <h1>C - Sudoku</h1>
      </div>
    );
  }
}

export default Header;
