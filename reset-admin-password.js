import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './server/models/User.js';

const resetAdminPassword = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/golden-creative-hub');
    console.log('Connected to MongoDB\n');

    // Find admin user and explicitly select password field
    const adminUser = await User.findOne({ email: 'rajkayal7281@gmail.com' }).select('+password');
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('Found admin user:', adminUser.name);
    console.log('Current password hash exists:', !!adminUser.password);
    console.log('Password hash length:', adminUser.password?.length || 0);
    
    // Set new password - use plain text, let the pre-save hook hash it
    const newPassword = 'admin123';
    
    adminUser.password = newPassword;
    await adminUser.save();
    
    console.log('\n✅ Admin password reset successfully!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Email: rajkayal7281@gmail.com');
    console.log('Password: admin123');
    console.log('\nPlease use these credentials to login.');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();
