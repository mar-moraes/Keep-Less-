import React from 'react';
import './Header.css';

const Header = ({ toggleSidebar, user, onLogout, isSaving }) => {
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
        </div>
      </div>

      <div className="header-right">
        {/* Refresh: visível sempre */}
        <button className="icon-button" onClick={() => window.location.reload()} disabled={isSaving}>
          <span className={`material-icons ${isSaving ? 'spin-animation' : ''}`}>refresh</span>
        </button>
        {/* Estes dois somem em mobile (< 768px) */}
        <button className="icon-button btn-header-desktop">
          <span className="material-icons">view_agenda</span>
        </button>
        <button className="icon-button btn-header-desktop">
          <span className="material-icons">settings</span>
        </button>

        {user && (
          <>
            <div className="profile-icon btn-header-secondary" title={user.name || user.email}>
              {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </div>
            <button className="icon-button" onClick={onLogout} title="Logout">
              <span className="material-icons">logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
