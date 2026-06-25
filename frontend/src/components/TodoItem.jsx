/**
 * components/TodoItem.jsx
 * Renders a single todo row in the list.
 * Provides toggle-complete, view-details, edit, and delete actions.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @param {object}   props
 * @param {object}   props.todo        - The todo data object
 * @param {Function} props.onToggle    - Called with todo.id to toggle completion
 * @param {Function} props.onEdit      - Called with todo to open edit modal
 * @param {Function} props.onDelete    - Called with todo.id to delete
 */
function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate();

  // Format the ISO date string to a readable locale format
  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = () => {
    navigate(`/todo?id=${todo.id}`);
  };

  return (
    <li
      className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}
      aria-label={`Todo: ${todo.title}`}
    >
      {/* Completion Checkbox */}
      <button
        className={`todo-checkbox ${todo.completed ? 'todo-checkbox--checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
        title={todo.completed ? 'Mark as pending' : 'Mark as completed'}
        type="button"
      >
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>

      {/* Todo Content */}
      <div className="todo-content">
        <p className={`todo-title ${todo.completed ? 'todo-title--strikethrough' : ''}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        <div className="todo-meta">
          <span className={`todo-badge ${todo.completed ? 'badge--completed' : 'badge--pending'}`}>
            {todo.completed ? '✅ Completed' : '🕐 Pending'}
          </span>
          <span className="todo-date">Added {formatDate(todo.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="todo-actions">
        <button
          className="action-btn action-btn--view"
          onClick={handleViewDetails}
          aria-label={`View details for: ${todo.title}`}
          title="View details"
          type="button"
        >
          👁
        </button>
        <button
          className="action-btn action-btn--edit"
          onClick={() => onEdit(todo)}
          aria-label={`Edit: ${todo.title}`}
          title="Edit todo"
          type="button"
        >
          ✏️
        </button>
        <button
          className="action-btn action-btn--delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete: ${todo.title}`}
          title="Delete todo"
          type="button"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
