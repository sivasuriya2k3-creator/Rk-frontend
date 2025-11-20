import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('\n=== Environment Variables Check ===\n');
console.log('SKIP_OTP:', process.env.SKIP_OTP);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '(set)' : '(not set)');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('\n=== Check Complete ===\n');
