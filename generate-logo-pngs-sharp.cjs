const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = path.join(__dirname, 'public', 'rk-badge-small.svg');
const svgBuffer = fs.readFileSync(svgPath);

// Logo sizes needed for different pages
const logoSizes = [
  { size: 32, name: 'rk-logo-favicon.png', description: 'Favicon (32x32)' },
  { size: 40, name: 'rk-logo-footer.png', description: 'Footer (40x40)' },
  { size: 48, name: 'rk-logo-navbar.png', description: 'Navbar (48x48)' },
  { size: 64, name: 'rk-logo-auth.png', description: 'Auth Pages (64x64)' },
  { size: 128, name: 'rk-logo-hero.png', description: 'Hero Section (128x128)' },
  { size: 256, name: 'rk-logo-large.png', description: 'Large/HD (256x256)' }
];

async function generateLogos() {
  console.log('Generating PNG logos from SVG...\n');
  
  const outputDir = path.join(__dirname, 'public');
  
  for (const { size, name, description } of logoSizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(path.join(outputDir, name));
      
      console.log(`✓ Created ${name} - ${description}`);
    } catch (error) {
      console.error(`✗ Failed to create ${name}:`, error.message);
    }
  }
  
  console.log('\n✓ All logo PNG files generated successfully!');
  console.log('\nGenerated files in public/ directory:');
  logoSizes.forEach(({ name, size }) => {
    console.log(`  - ${name} (${size}x${size}px)`);
  });
  
  console.log('\nNext step: Update component files to use PNG logos.');
}

// Check if sharp module is available
try {
  require.resolve('sharp');
  generateLogos().catch(error => {
    console.error('\nError generating logos:', error.message);
    console.error('\nMake sure sharp is installed: npm install sharp');
  });
} catch (e) {
  console.error('Error: "sharp" package not found.');
  console.error('\nPlease install it first:');
  console.error('  npm install sharp');
  console.error('\nsharp is easier to install on Windows than canvas.');
}
