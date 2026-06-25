/**
 * pages/NotFound.jsx
 * Fallback page for 404 routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-container not-found-page fade-in">
      <div className="error-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🕵️</div>
      <h1 className="page-title">404 - Page Not Found</h1>
      <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/todos" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
