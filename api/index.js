// Vercel serverless adapter for Express
// This file imports the Express app from /server and handles all API requests

let app = null;
let loadError = null;

export default async function handler(req, res) {
  console.log('[API Handler]', req.method, req.url);
  
  if (!app && !loadError) {
    try {
      // Import the Express app (without starting the HTTP server)
      const module = await import('../server/index.js');
      app = module.default;
      console.log('[API] Express app loaded successfully');
    } catch (err) {
      loadError = err;
      console.error('[API] Failed to load Express app:', err.message);
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: err.message,
        stack: err.stack 
      });
    }
  }
  
  if (loadError) {
    return res.status(500).json({ 
      error: 'Server configuration error', 
      message: loadError.message 
    });
  }
  
  // Fix URL: Vercel strips /api prefix, but Express routes are mounted at /api/*
  // So we need to add /api back to the URL
  const originalUrl = req.url;
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  console.log('[API] URL fixed:', originalUrl, '->', req.url);
  
  // Forward the request to Express
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('[API Error]', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
        reject(err);
      } else {
        if (!res.headersSent) {
          res.status(404).json({ error: 'Not found', path: req.url });
        }
        resolve();
      }
    });
  });
}