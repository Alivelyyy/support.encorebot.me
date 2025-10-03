
// Vercel serverless function entry point
// This file must use CommonJS because Vercel's Node runtime expects it
const path = require('path');
const express = require('express');

// We need to load the built Express app
let app;

try {
  // In production (Vercel), load from dist
  app = require('../dist/index.js').default;
} catch (err) {
  console.error('Failed to load app from dist:', err);
  // Fallback: create a minimal Express app
  app = express();
  app.get('*', (req, res) => {
    res.status(500).json({ error: 'Application failed to load' });
  });
}

module.exports = app;
