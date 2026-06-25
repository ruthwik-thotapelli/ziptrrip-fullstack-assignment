/**
 * api/index.js
 * Vercel Serverless Function entry point.
 * Vercel automatically maps this file to /api/index
 */
const app = require('../backend/server');

module.exports = app;
