/**
 * server.js
 * Entry point for the Todo Application backend.
 * Sets up Express, applies middleware, mounts routes, and starts the server.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Enable Cross-Origin Resource Sharing so the React frontend can communicate
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Simple request logger middleware
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Mount all /todos routes
app.use('/todos', todoRoutes);

// Health-check root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Todo API is running 🚀',
    version: '1.0.0',
    endpoints: {
      'GET /todos': 'Retrieve all todos',
      'GET /todos/:id': 'Retrieve a single todo by ID',
      'POST /todos': 'Create a new todo',
      'PUT /todos/:id': 'Update a todo by ID',
      'DELETE /todos/:id': 'Delete a todo by ID',
    },
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ─── Start Server / Export ───────────────────────────────────────────────────

// Only listen if we are not running in a Vercel Serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅  Todo API server listening on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;
