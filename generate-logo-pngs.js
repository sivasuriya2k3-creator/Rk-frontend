const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Logo sizes needed for different pages
const logoSizes = {
  'favicon': { size: 32, name: 'rk-logo-favicon.png' },
  'navbar': { size: 48, name: 'rk-logo-navbar.png' },
  'footer': { size: 40, name: 'rk-logo-footer.png' },
  'auth': { size: 64, name: 'rk-logo-auth.png' },
  'hero': { size: 128, name: 'rk-logo-hero.png' },
  'large': { size: 256, name: 'rk-logo-large.png' }
};

function drawLogo(canvas, size) {
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Create gold gradient
  const goldGradient = ctx.createRadialGradient(center, center, 0, center, center, center * 0.9);
  goldGradient.addColorStop(0, '#FFD700');
  goldGradient.addColorStop(0.5, '#FFC800');
  goldGradient.addColorStop(1, '#D4AF37');
  
  // Draw outer golden circle
  ctx.beginPath();
  ctx.arc(center, center, size * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = goldGradient;
  ctx.fill();
  
  // Draw inner black circle
  ctx.beginPath();
  ctx.arc(center, center, size * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  
  // Draw crown
  const crownScale = size / 200;
  const crownY = center - size * 0.15;
  
  ctx.save();
  ctx.translate(center, crownY);
  ctx.scale(crownScale * 0.25, crownScale * 0.25);
  
  // Crown path
  ctx.beginPath();
  ctx.moveTo(-70, 30);
  ctx.lineTo(-70, 10);
  ctx.lineTo(-50, -20);
  ctx.lineTo(-30, 10);
  ctx.lineTo(0, -30);
  ctx.lineTo(30, 10);
  ctx.lineTo(50, -20);
  ctx.lineTo(70, 10);
  ctx.lineTo(70, 30);
  ctx.closePath();
  
  const crownGradient = ctx.createRadialGradient(0, -10, 0, 0, -10, 60);
  crownGradient.addColorStop(0, '#FFD700');
  crownGradient.addColorStop(1, '#D4AF37');
  ctx.fillStyle = crownGradient;
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Crown jewels
  ctx.beginPath();
  ctx.arc(-50, -15, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#FF0000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(0, -25, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#00CED1';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(50, -15, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#FF0000';
  ctx.fill();
  
  ctx.restore();
  
  // Draw RK text
  const textGradient = ctx.createRadialGradient(center, center * 0.9, 0, center, center * 0.9, size * 0.3);
  textGradient.addColorStop(0, '#FFD700');
  textGradient.addColorStop(1, '#D4AF37');
  
  ctx.fillStyle = textGradient;
  ctx.font = `bold ${size * 0.175}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RK', center, center + size * 0.075);
  
  // Draw decorative flourish
  ctx.save();
  ctx.translate(center, center + size * 0.1);
  ctx.scale(crownScale * 0.25, crownScale * 0.25);
  ctx.beginPath();
  ctx.moveTo(-80, 0);
  ctx.quadraticCurveTo(-60, -15, -40, 0);
  ctx.quadraticCurveTo(-20, 15, 0, 0);
  ctx.quadraticCurveTo(20, -15, 40, 0);
  ctx.quadraticCurveTo(60, 15, 80, 0);
  ctx.strokeStyle = goldGradient;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  
  // Small superscript 2
  ctx.fillStyle = textGradient;
  ctx.font = `bold ${size * 0.05}px serif`;
  ctx.fillText('2', center + size * 0.15, center);
  
  // RAJKAYAL text
  if (size >= 64) {
    ctx.fillStyle = '#D4AF37';
    ctx.font = `bold ${size * 0.05}px Arial, sans-serif`;
    ctx.letterSpacing = '2px';
    ctx.fillText('RAJKAYAL', center, center + size * 0.2);
  }
  
  // DESIGNING STUDIO text
  if (size >= 128) {
    ctx.fillStyle = '#D4AF37';
    ctx.font = `${size * 0.025}px Arial, sans-serif`;
    ctx.letterSpacing = '1px';
    ctx.fillText('DESIGNING STUDIO', center, center + size * 0.25);
  }
}

async function generateLogos() {
  console.log('Generating PNG logos...\n');
  
  const outputDir = path.join(__dirname, 'public');
  
  for (const [key, { size, name }] of Object.entries(logoSizes)) {
    const canvas = createCanvas(size, size);
    drawLogo(canvas, size);
    
    const buffer = canvas.toBuffer('image/png');
    const outputPath = path.join(outputDir, name);
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ Created ${name} (${size}x${size}px)`);
  }
  
  console.log('\n✓ All logo PNG files generated successfully!');
  console.log('\nGenerated files:');
  Object.values(logoSizes).forEach(({ name, size }) => {
    console.log(`  - public/${name} (${size}x${size}px)`);
  });
}

// Check if canvas module is available
try {
  require.resolve('canvas');
  generateLogos().catch(console.error);
} catch (e) {
  console.error('Error: "canvas" package not found.');
  console.error('Please install it first: npm install canvas');
  console.error('\nNote: canvas requires additional system dependencies:');
  console.error('- Windows: Install windows-build-tools (npm install --global windows-build-tools)');
  console.error('- Or use the alternative script with sharp instead');
}
