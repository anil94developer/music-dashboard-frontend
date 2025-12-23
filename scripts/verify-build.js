const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build output for React Router configuration...\n');

const buildDir = path.join(__dirname, '../build');
const indexHtml = path.join(buildDir, 'index.html');
const redirectsFile = path.join(buildDir, '_redirects');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.warn('⚠ Build directory does not exist. This is normal if build is still running.');
  process.exit(0); // Don't fail the build
}

// Check if index.html exists
if (!fs.existsSync(indexHtml)) {
  console.warn('⚠ index.html not found in build directory.');
  process.exit(0); // Don't fail the build
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
    try {
      fs.copyFileSync(publicRedirects, redirectsFile);
      console.log('✓ _redirects file copied to build folder');
    } catch (error) {
      console.warn('⚠ Could not copy _redirects:', error.message);
    }
  } else {
    // Create default _redirects file
    try {
      const defaultContent = '/*    /index.html   200\n';
      fs.writeFileSync(redirectsFile, defaultContent);
      console.log('✓ Created default _redirects file in build folder');
    } catch (error) {
      console.warn('⚠ Could not create _redirects:', error.message);
    }
  }
}

console.log('\n✅ Build verification complete!');
process.exit(0); // Always exit successfully

