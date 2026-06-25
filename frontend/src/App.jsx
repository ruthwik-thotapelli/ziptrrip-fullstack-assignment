/**
 * App.jsx
 * Root application component.
 * Defines all page routes using React Router v6.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodoList from './pages/TodoList';
import TodoDetail from './pages/TodoDetail';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      {/* Top navigation bar rendered on every page */}
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Redirect root to /todos */}
          <Route path="/" element={<Navigate to="/todos" replace />} />

          {/* Todo List page — displays all todos */}
          <Route path="/todos" element={<TodoList />} />

          {/* Single Todo Detail page — receives ?id=<uuid> query param */}
          <Route path="/todo" element={<TodoDetail />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
