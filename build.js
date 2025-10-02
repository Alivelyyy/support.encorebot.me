
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Build the client from the client directory
process.chdir(path.join(__dirname, 'client'));
execSync('npx vite build', { stdio: 'inherit' });

// Go back to root and build the server
process.chdir(__dirname);
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=cjs --outdir=dist', { stdio: 'inherit' });
