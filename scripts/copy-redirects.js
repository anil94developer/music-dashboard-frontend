const fs = require('fs');
const path = require('path');

// Ensure _redirects file is copied to build folder
const sourceFile = path.join(__dirname, '../public/_redirects');
const destFile = path.join(__dirname, '../build/_redirects');

if (fs.existsSync(sourceFile)) {
  // Ensure build directory exists
  const buildDir = path.join(__dirname, '../build');
  if (!fs.existsSync(buildDir)) {
    console.log('Build directory does not exist yet. This script should run after build.');
    process.exit(0);
  }
  
  // Copy _redirects file
  fs.copyFileSync(sourceFile, destFile);
  console.log('✓ _redirects file copied to build folder');
  
  // Verify it was copied
  if (fs.existsSync(destFile)) {
    const content = fs.readFileSync(destFile, 'utf8');
    console.log('✓ _redirects content:', content.trim());
  } else {
    console.error('✗ Failed to copy _redirects file');
    process.exit(1);
  }
} else {
  console.log('⚠ _redirects file not found in public folder');
}

