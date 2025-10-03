
// Vercel serverless function entry point
// Bridge CommonJS to ESM module

async function handler(req, res) {
  try {
    // Dynamically import the ESM module
    const { default: app } = await import('../dist/index.js');
    
    // Forward the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error('Failed to load Express app:', error);
    res.status(500).json({ 
      error: 'Application failed to load',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

module.exports = handler;
