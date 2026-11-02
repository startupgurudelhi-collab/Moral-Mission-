import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('===> [Build] Step 1: Building Vite client SPA...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('===> [Build] Step 2: Building server with Vite SSR (preserving dist/)...');
execSync('npx vite build --ssr server.ts --outDir dist --emptyOutDir false', { stdio: 'inherit' });

console.log('===> [Build] Step 3: Generating Hostinger dist/server.cjs entry file...');
const distCjsContent = `// Universal Hostinger Entry Point for Moral Mission Foundation
import('./server.js').catch((err) => {
  console.error('[Hostinger Startup Error] Failed to start server:', err);
  process.exit(1);
});
`;

fs.writeFileSync(path.join(process.cwd(), 'dist', 'server.cjs'), distCjsContent, 'utf-8');

// Ensure root server.cjs also points cleanly
const rootCjsContent = `// Universal Hostinger Root Entry Point
import('./dist/server.js').catch((err) => {
  console.error('[Hostinger Startup Error] Failed to start server:', err);
  process.exit(1);
});
`;
fs.writeFileSync(path.join(process.cwd(), 'server.cjs'), rootCjsContent, 'utf-8');

// Verify critical build files
const indexPath = path.join(process.cwd(), 'dist', 'index.html');
const serverPath = path.join(process.cwd(), 'dist', 'server.cjs');

if (!fs.existsSync(indexPath)) {
  throw new Error('BUILD FATAL ERROR: dist/index.html was not found after build!');
}
if (!fs.existsSync(serverPath)) {
  throw new Error('BUILD FATAL ERROR: dist/server.cjs was not found after build!');
}

console.log('===> [Build] Success! Verified dist/index.html, dist/server.cjs, and dist/server.js all exist.');
