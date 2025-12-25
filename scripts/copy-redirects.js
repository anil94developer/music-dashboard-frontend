const fs = require('fs');
const path = require('path');

// Ensure _redirects file is copied to build folder
const sourceFile = path.join(__dirname, '../public/_redirects');
const destFile = path.join(__dirname, '../build/_redirects');
const buildDir = path.join(__dirname, '../build');

console.log('📦 Copying redirect files to build folder...');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  console.log('⚠ Build directory does not exist yet. This script should run after build.');
  process.exit(0); // Don't fail, just exit
}

// Copy _redirects file
if (fs.existsSync(sourceFile)) {
  try {
    fs.copyFileSync(sourceFile, destFile);
    console.log('✓ _redirects file copied to build folder');
    
    // Verify it was copied
    if (fs.existsSync(destFile)) {
      const content = fs.readFileSync(destFile, 'utf8');
      console.log('✓ _redirects content:', content.trim());
    } else {
      console.warn('⚠ Failed to copy _redirects file, will create default');
      // Create default instead of failing
      const defaultContent = '/*    /index.html   200\n';
      try {
        fs.writeFileSync(destFile, defaultContent);
        console.log('✓ Created default _redirects file');
      } catch (err) {
        console.warn('⚠ Could not create default _redirects:', err.message);
      }
    }
  } catch (error) {
    console.warn('⚠ Error copying _redirects:', error.message);
    // Try to create default
    try {
      const defaultContent = '/*    /index.html   200\n';
      fs.writeFileSync(destFile, defaultContent);
      console.log('✓ Created default _redirects file as fallback');
    } catch (err) {
      console.warn('⚠ Could not create fallback _redirects');
    }
  }
} else {
  console.log('⚠ _redirects file not found in public folder');
  // Create a default _redirects file
  const defaultContent = '/*    /index.html   200\n';
  try {
    fs.writeFileSync(destFile, defaultContent);
    console.log('✓ Created default _redirects file in build folder');
  } catch (error) {
    console.warn('⚠ Error creating default _redirects:', error.message);
  }
}

// Also copy .htaccess if it exists (for other hosting platforms)
const htaccessSource = path.join(__dirname, '../public/.htaccess');
const htaccessDest = path.join(__dirname, '../build/.htaccess');
if (fs.existsSync(htaccessSource)) {
  try {
    fs.copyFileSync(htaccessSource, htaccessDest);
    console.log('✓ .htaccess file copied to build folder');
  } catch (error) {
    console.log('⚠ Could not copy .htaccess:', error.message);
  }
}

// Copy static.json if it exists (for Render alternative config)
const staticJsonSource = path.join(__dirname, '../public/static.json');
const staticJsonDest = path.join(__dirname, '../build/static.json');
if (fs.existsSync(staticJsonSource)) {
  try {
    fs.copyFileSync(staticJsonSource, staticJsonDest);
    console.log('✓ static.json file copied to build folder');
  } catch (error) {
    console.log('⚠ Could not copy static.json:', error.message);
  }
}

console.log('✅ Redirect files setup complete!');
// Always exit successfully to not break the build
process.exit(0);
