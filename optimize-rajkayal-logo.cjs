const sharp = require('sharp');
const path = require('path');

// Source logo
const sourceLogo = path.join(__dirname, 'public', 'rajkayal-logo.png');

// Logo sizes needed for different pages
const logoSizes = [
  { size: 32, name: 'rajkayal-favicon.png', description: 'Favicon (32x32)' },
  { size: 40, name: 'rajkayal-footer.png', description: 'Footer (40x40)' },
  { size: 48, name: 'rajkayal-navbar.png', description: 'Navbar (48x48)' },
  { size: 64, name: 'rajkayal-auth.png', description: 'Auth Pages (64x64)' },
  { size: 128, name: 'rajkayal-hero.png', description: 'Hero Section (128x128)' },
  { size: 256, name: 'rajkayal-large.png', description: 'Large/HD (256x256)' }
];

async function optimizeLogos() {
  console.log('Optimizing RajKayal logo for different sizes...\n');
  
  const outputDir = path.join(__dirname, 'public');
  
  for (const { size, name, description } of logoSizes) {
    try {
      await sharp(sourceLogo)
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
  
  console.log('\n✓ All RajKayal logo sizes generated successfully!');
  console.log('\nGenerated files in public/ directory:');
  logoSizes.forEach(({ name, size }) => {
    console.log(`  - ${name} (${size}x${size}px)`);
  });
  
  console.log('\nNext step: Updating component files to use the new logos.');
}

optimizeLogos().catch(error => {
  console.error('\nError optimizing logos:', error.message);
});
