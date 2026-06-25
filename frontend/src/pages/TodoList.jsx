/**
 * pages/TodoList.jsx
 * Main page that lists all todos.
 * Handles fetching, creating, updating, toggling, and deleting todos.
 * Displays the TodoForm modal when adding or editing.
 */

import React, { useState, useEffect } from 'react';
import { fetchAllTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Fetch todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchAllTodos();
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to load todos:', err);
      setError('Could not load your todos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleOpenAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingTodo) {
        // Update existing
        const res = await updateTodo(editingTodo.id, formData);
        setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? res.data : t)));
      } else {
        // Create new
        const res = await createTodo(formData);
        setTodos((prev) => [res.data, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save todo:', err);
      alert('Failed to save todo. Check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    const todoToToggle = todos.find((t) => t.id === id);
    if (!todoToToggle) return;

    const previousTodos = [...todos];
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await updateTodo(id, { completed: !todoToToggle.completed });
    } catch (err) {
      console.error('Failed to toggle todo:', err);
      // Revert on failure
      setTodos(previousTodos);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
      alert('Failed to delete todo.');
    }
  };

  // ─── Render Helpers ─────────────────────────────────────────────────────────

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Sort: pending first, then by creation date (newest first)
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="page-container fade-in">
      {/* Header section with title and add button */}
      <header className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Manage your daily goals and stay organised.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          ➕ Add New Task
        </button>
      </header>

      {/* Filter tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button className="btn btn-secondary" onClick={loadTodos}>Retry</button>
        </div>
      ) : sortedTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {filter === 'all'
              ? "You don't have any tasks yet. Add one above!"
              : `You have no ${filter} tasks.`}
          </p>
        </div>
      ) : (
        <ul className="todo-list">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <TodoForm
          initialValues={editingTodo || {}}
          isEditMode={!!editingTodo}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}

export default TodoList;
