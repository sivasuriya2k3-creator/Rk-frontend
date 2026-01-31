import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.prod') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Admin user details
const ADMIN_EMAIL = 'rajkayal7281@gmail.com';
const ADMIN_PASSWORD = 'rajkayal2025';
const ADMIN_NAME = 'RajKayal Admin';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('⚠ Admin user already exists');
      console.log('Updating admin user...');
      
      // Update existing admin
      existingAdmin.name = ADMIN_NAME;
      existingAdmin.password = ADMIN_PASSWORD;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('✓ Admin user updated successfully');
    } else {
      // Create new admin user
      const adminUser = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });

      console.log('✓ Admin user created successfully');
      console.log({
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      });
    }

    console.log('\n=== Admin Login Credentials ===');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Role: admin`);
    console.log('OTP verification will be required on login');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
