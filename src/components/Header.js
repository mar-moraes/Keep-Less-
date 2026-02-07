import React from 'react';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-button" onClick={toggleSidebar}>
          <span className="material-icons">menu</span>
        </button>

        <span className="logo-text">Keep Less</span>
      </div>

      <div className="header-middle">
        <div className="search-bar">
          <button className="icon-button search-icon">
            <span className="material-icons">search</span>
          </button>
          <input type="text" placeholder="Search" />
          <button className="icon-button clear-icon">
            <span className="material-icons">close</span>
          </button>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-button">
          <span className="material-icons">refresh</span>
        </button>
        <button className="icon-button">
          <span className="material-icons">view_agenda</span>
        </button>
        <button className="icon-button">
          <span className="material-icons">settings</span>
        </button>

      </div>
    </header>
  );
};

export default Header;
