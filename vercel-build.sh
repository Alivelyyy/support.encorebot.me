
#!/bin/bash
set -e

echo "Building client..."
npm run vercel-build

echo "Build complete!"
echo "Vercel will use the built files from dist/"
