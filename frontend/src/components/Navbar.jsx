/**
 * components/Navbar.jsx
 * Top navigation bar displayed on every page.
 * Shows the brand name and links to the Todo List page.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <Link to="/todos" className="navbar-brand" aria-label="TodoApp home">
          <span className="brand-icon" aria-hidden="true">✓</span>
          <span className="brand-name">TodoApp</span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-links" role="list">
          <li>
            <Link
              to="/todos"
              className={`nav-link ${pathname === '/todos' ? 'nav-link--active' : ''}`}
              aria-current={pathname === '/todos' ? 'page' : undefined}
            >
              All Todos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
