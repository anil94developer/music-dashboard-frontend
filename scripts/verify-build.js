const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build output for React Router configuration...\n');

const buildDir = path.join(__dirname, '../build');
const indexHtml = path.join(buildDir, 'index.html');
const redirectsFile = path.join(buildDir, '_redirects');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexHtml)) {
  console.error('❌ index.html not found in build directory.');
  process.exit(1);
} else {
  console.log('✓ index.html found');
}

// Check if _redirects file exists
if (fs.existsSync(redirectsFile)) {
  const content = fs.readFileSync(redirectsFile, 'utf8');
  console.log('✓ _redirects file found');
  console.log('  Content:', content.trim());
} else {
  console.warn('⚠ _redirects file not found in build directory');
  console.log('  Attempting to copy from public folder...');
  
  const publicRedirects = path.join(__dirname, '../public/_redirects');
  if (fs.existsSync(publicRedirects)) {
    fs.copyFileSync(publicRedirects, redirectsFile);
    console.log('✓ _redirects file copied to build folder');
  } else {
    console.error('❌ _redirects file not found in public folder either');
  }
}

// List all files in build directory (for debugging)
console.log('\n📁 Build directory contents:');
const files = fs.readdirSync(buildDir);
files.forEach(file => {
  const filePath = path.join(buildDir, file);
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
    console.log(`  - ${file} (${stats.size} bytes)`);
  }
});

console.log('\n✅ Build verification complete!');

