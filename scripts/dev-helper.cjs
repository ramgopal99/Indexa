#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ChatGPT Side Indexer - Development Mode');
console.log('=====================================');

// Check if extension is built
const distPath = path.join(__dirname, '..', 'dist');
const manifestPath = path.join(distPath, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.log('❌ Extension not built yet!');
  console.log('');
  console.log('Run one of these commands:');
  console.log('  npm run build:dev    # Build for development');
  console.log('  npm run dev:watch    # Build and start watch mode');
  process.exit(1);
}

console.log('✅ Extension built successfully!');
console.log('');

console.log('🔧 Development Workflow:');
console.log('');
console.log('1. Make changes to your code in src/ folder');
console.log('2. Run: npm run watch (in another terminal)');
console.log('3. Go to chrome://extensions/');
console.log('4. Click the ↻ (reload) button on your extension');
console.log('5. Refresh ChatGPT page to test changes');
console.log('');

console.log('🎯 Quick Commands:');
console.log('  npm run build:dev    # Build once');
console.log('  npm run watch        # Watch for changes');
console.log('  npm run dev:watch    # Build + watch');
console.log('');

console.log('📍 Extension loaded from:');
console.log(`   ${distPath}`);
console.log('');

console.log('🔄 After making changes:');
console.log('   1. Files auto-rebuild');
console.log('   2. Reload extension in Chrome');
console.log('   3. Refresh ChatGPT page');
console.log('');

console.log('✨ Happy coding!');

// Optional: Show manifest info
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`📦 ${manifest.name} v${manifest.version}`);
} catch (error) {
  // ignore
}
