/**
 * pages/TodoDetail.jsx
 * Displays details of a single todo.
 * Receives the todo ID via a query parameter: /todo?id=123
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { fetchTodoById } from '../api/todos';

function TodoDetail() {
  const [todo, setTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract 'id' from query parameters
  const queryParams = new URLSearchParams(location.search);
  const todoId = queryParams.get('id');

  useEffect(() => {
    // If no ID is provided, show an error immediately
    if (!todoId) {
      setError('No Todo ID provided in the URL.');
      setIsLoading(false);
      return;
    }

    const loadTodo = async () => {
      try {
        setIsLoading(true);
        const res = await fetchTodoById(todoId);
        setTodo(res.data);
      } catch (err) {
        console.error('Failed to load todo detail:', err);
        // If it's a 404, we can provide a specific message
        if (err.response && err.response.status === 404) {
          setError(`Todo with ID "${todoId}" was not found.`);
        } else {
          setError('An error occurred while fetching the todo details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTodo();
  }, [todoId]);

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown';
    return new Date(isoString).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container fade-in detail-page">
      <Link to="/todos" className="back-link">
        ← Back to List
      </Link>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading details...</p>
        </div>
      ) : error ? (
        <div className="error-state detail-card">
          <div className="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/todos')}>
            Return Home
          </button>
        </div>
      ) : todo ? (
        <article className="detail-card">
          <header className="detail-header">
            <h1 className="detail-title">{todo.title}</h1>
            <span className={`detail-badge ${todo.completed ? 'badge--completed' : 'badge--pending'}`}>
              {todo.completed ? '✅ Completed' : '🕐 Pending'}
            </span>
          </header>

          <section className="detail-body">
            <h3>Description</h3>
            {todo.description ? (
              <p className="detail-description">{todo.description}</p>
            ) : (
              <p className="detail-description empty-desc">No description provided.</p>
            )}
          </section>

          <footer className="detail-footer">
            <div className="meta-info">
              <span className="meta-label">ID:</span>
              <span className="meta-value code">{todo.id}</span>
            </div>
            <div className="meta-info">
              <span className="meta-label">Created:</span>
              <span className="meta-value">{formatDate(todo.createdAt)}</span>
            </div>
            <div className="meta-info">
              <span className="meta-label">Last Updated:</span>
              <span className="meta-value">{formatDate(todo.updatedAt)}</span>
            </div>
          </footer>
        </article>
      ) : null}
    </div>
  );
}

export default TodoDetail;
