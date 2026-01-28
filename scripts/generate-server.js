import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverContent = `// Vercel Production Entry Point
import app from '../server/index.js';
export default app;
`;

const distDir = path.join(__dirname, '../dist');
const serverFile = path.join(distDir, 'server.js');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write server.js
fs.writeFileSync(serverFile, serverContent, 'utf-8');
console.log('✓ Generated dist/server.js for Vercel');

