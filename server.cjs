// Universal Hostinger Entry Point
const path = require('path');
const fs = require('fs');

const distFile = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distFile)) {
  require(distFile);
} else {
  console.log('[Hostinger Boot] dist/server.cjs not found yet. Running build...');
  try {
    require('child_process').execSync('npm run build', { stdio: 'inherit' });
    if (fs.existsSync(distFile)) {
      require(distFile);
    } else {
      console.error('[Hostinger Boot Error] dist/server.cjs is still missing after build.');
      process.exit(1);
    }
  } catch (err) {
    console.error('[Hostinger Boot Error] Failed to build application:', err);
    process.exit(1);
  }
}
