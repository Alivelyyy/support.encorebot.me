
// Import the Express app from the built server
const app = require('../dist/index.js').default;

// Export for Vercel
module.exports = app;
