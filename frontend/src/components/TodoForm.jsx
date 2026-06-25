/**
 * components/TodoForm.jsx
 * Modal dialog for creating or editing a todo.
 * Receives initial values via props for edit mode.
 * Performs client-side validation before calling onSubmit.
 */

import React, { useState, useEffect, useRef } from 'react';

/**
 * @param {object}   props
 * @param {object}   props.initialValues   - Prefill values for edit mode { title, description }
 * @param {boolean}  props.isEditMode      - True when editing an existing todo
 * @param {Function} props.onSubmit        - Called with { title, description } on valid submit
 * @param {Function} props.onClose         - Called when the modal is dismissed
 * @param {boolean}  props.isLoading       - Disables form while async work is in progress
 */
function TodoForm({ initialValues = {}, isEditMode = false, onSubmit, onClose, isLoading }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [errors, setErrors] = useState({});

  // Auto-focus the title field when the modal opens
  const titleRef = useRef(null);
  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  /**
   * Run client-side validation rules.
   * @returns {boolean} True if form is valid
   */
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must not exceed 200 characters.';
    }
    if (description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    /* Backdrop — clicking it closes the modal */
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditMode ? '✏️  Edit Todo' : '➕  New Todo'}
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="todo-title" className="form-label">
              Title <span className="required-star" aria-hidden="true">*</span>
            </label>
            <input
              id="todo-title"
              ref={titleRef}
              type="text"
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={200}
              disabled={isLoading}
              aria-describedby={errors.title ? 'title-error' : undefined}
              aria-required="true"
            />
            {errors.title && (
              <p id="title-error" className="form-error" role="alert">{errors.title}</p>
            )}
            <p className="char-count">{title.length}/200</p>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="todo-description" className="form-label">
              Description <span className="optional-label">(optional)</span>
            </label>
            <textarea
              id="todo-description"
              className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task…"
              maxLength={1000}
              rows={4}
              disabled={isLoading}
              aria-describedby={errors.description ? 'desc-error' : undefined}
            />
            {errors.description && (
              <p id="desc-error" className="form-error" role="alert">{errors.description}</p>
            )}
            <p className="char-count">{description.length}/1000</p>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoForm;
