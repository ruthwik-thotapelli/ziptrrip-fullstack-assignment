/**
 * api/todos.js
 * Centralised Axios API layer for all /todos HTTP requests.
 * Keeping API calls here makes components cleaner and easier to test.
 */

import axios from 'axios';

// Base URL: uses relative path in production (Vercel), or proxy/env var in development
const BASE_URL = import.meta.env.PROD 
  ? '' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL: `${BASE_URL}/todos`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10-second timeout
});

/**
 * Fetch all todos.
 * @returns {Promise<Array>} Array of todo objects
 */
export const fetchAllTodos = async () => {
  const response = await api.get('/');
  return response.data; // { success, count, data }
};

/**
 * Fetch a single todo by ID.
 * @param {string} id - Todo UUID
 * @returns {Promise<object>} Todo object
 */
export const fetchTodoById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data; // { success, data }
};

/**
 * Create a new todo.
 * @param {{ title: string, description?: string }} payload
 * @returns {Promise<object>} Created todo object
 */
export const createTodo = async (payload) => {
  const response = await api.post('/', payload);
  return response.data; // { success, message, data }
};

/**
 * Update an existing todo.
 * @param {string} id - Todo UUID
 * @param {{ title?: string, description?: string, completed?: boolean }} payload
 * @returns {Promise<object>} Updated todo object
 */
export const updateTodo = async (id, payload) => {
  const response = await api.put(`/${id}`, payload);
  return response.data; // { success, message, data }
};

/**
 * Delete a todo by ID.
 * @param {string} id - Todo UUID
 * @returns {Promise<object>} Deleted todo object
 */
export const deleteTodo = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data; // { success, message, data }
};
