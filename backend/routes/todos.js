/**
 * routes/todos.js
 * RESTful CRUD route handlers for the /todos resource.
 * Data is persisted to data/todos.json on every write operation.
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Absolute path to the JSON data file
const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Read all todos from the JSON data file.
 * @returns {Array} Array of todo objects
 */
function readTodos() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    // Return empty array if file doesn't exist or is malformed
    return [];
  }
}

/**
 * Write the todos array back to the JSON data file.
 * @param {Array} todos - Array of todo objects to persist
 */
function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

/**
 * Validate fields for creating/updating a todo.
 * @param {object} body - Request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateTodoInput(body) {
  const errors = [];

  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string.');
  }

  if (body.title && body.title.trim().length > 200) {
    errors.push('Title must not exceed 200 characters.');
  }

  if (body.description && typeof body.description !== 'string') {
    errors.push('Description must be a string.');
  }

  if (body.description && body.description.length > 1000) {
    errors.push('Description must not exceed 1000 characters.');
  }

  return { valid: errors.length === 0, errors };
}

// ─── GET /todos ───────────────────────────────────────────────────────────────

/**
 * Retrieve all todos.
 * Optional query param ?completed=true|false to filter by status.
 */
router.get('/', (req, res) => {
  try {
    let todos = readTodos();

    // Optional filtering by completion status
    const { completed } = req.query;
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      todos = todos.filter((t) => t.completed === isCompleted);
    }

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (err) {
    console.error('GET /todos error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve todos.' });
  }
});

// ─── GET /todos/:id ───────────────────────────────────────────────────────────

/**
 * Retrieve a single todo by ID.
 */
router.get('/:id', (req, res) => {
  try {
    const todos = readTodos();
    const todo = todos.find((t) => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID "${req.params.id}" not found.`,
      });
    }

    res.json({ success: true, data: todo });
  } catch (err) {
    console.error(`GET /todos/${req.params.id} error:`, err);
    res.status(500).json({ success: false, message: 'Failed to retrieve todo.' });
  }
});

// ─── POST /todos ──────────────────────────────────────────────────────────────

/**
 * Create a new todo.
 * Body: { title: string, description?: string }
 */
router.post('/', (req, res) => {
  try {
    const { valid, errors } = validateTodoInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }

    const todos = readTodos();

    const newTodo = {
      id: uuidv4(),
      title: req.body.title.trim(),
      description: (req.body.description || '').trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully.',
      data: newTodo,
    });
  } catch (err) {
    console.error('POST /todos error:', err);
    res.status(500).json({ success: false, message: 'Failed to create todo.' });
  }
});

// ─── PUT /todos/:id ───────────────────────────────────────────────────────────

/**
 * Update an existing todo by ID.
 * Body: { title?: string, description?: string, completed?: boolean }
 */
router.put('/:id', (req, res) => {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID "${req.params.id}" not found.`,
      });
    }

    const { title, description, completed } = req.body;

    // Only validate title if it is being changed
    if (title !== undefined) {
      const { valid, errors } = validateTodoInput({ title, description });
      if (!valid) {
        return res.status(400).json({ success: false, message: 'Validation failed.', errors });
      }
    }

    // Merge changes into existing todo
    const updatedTodo = {
      ...todos[index],
      title: title !== undefined ? title.trim() : todos[index].title,
      description: description !== undefined ? description.trim() : todos[index].description,
      completed: completed !== undefined ? Boolean(completed) : todos[index].completed,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updatedTodo;
    writeTodos(todos);

    res.json({
      success: true,
      message: 'Todo updated successfully.',
      data: updatedTodo,
    });
  } catch (err) {
    console.error(`PUT /todos/${req.params.id} error:`, err);
    res.status(500).json({ success: false, message: 'Failed to update todo.' });
  }
});

// ─── DELETE /todos/:id ────────────────────────────────────────────────────────

/**
 * Delete a todo by ID.
 */
router.delete('/:id', (req, res) => {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID "${req.params.id}" not found.`,
      });
    }

    const deleted = todos.splice(index, 1)[0];
    writeTodos(todos);

    res.json({
      success: true,
      message: 'Todo deleted successfully.',
      data: deleted,
    });
  } catch (err) {
    console.error(`DELETE /todos/${req.params.id} error:`, err);
    res.status(500).json({ success: false, message: 'Failed to delete todo.' });
  }
});

module.exports = router;
