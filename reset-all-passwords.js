import mongoose from 'mongoose';
import User from './server/models/User.js';

const resetAllPasswords = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/golden-creative-hub');
    console.log('Connected to MongoDB\n');

    // Get all users with password field
    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users\n`);

    const passwords = {
      'rajkayal7281@gmail.com': 'admin123',
      'sivasuriyanraja569@gmail.com': 'password123',
      'jagathraj2k7@gmail.com': 'password123',
      'nsnamasivayen@gmail.com': 'password123'
    };

    for (const user of users) {
      const newPassword = passwords[user.email] || 'password123';
      
      console.log(`\nResetting password for: ${user.name} (${user.email})`);
      console.log(`  Current password exists: ${!!user.password}`);
      console.log(`  New password: ${newPassword}`);
      
      user.password = newPassword;
      await user.save();
      
      console.log(`  ✓ Password reset successfully`);
    }

    console.log('\n\n=== ALL LOGIN CREDENTIALS ===\n');
    console.log('Admin Account:');
    console.log('  Email: rajkayal7281@gmail.com');
    console.log('  Password: admin123\n');
    
    console.log('Regular Users:');
    console.log('  Email: sivasuriyanraja569@gmail.com');
    console.log('  Password: password123\n');
    
    console.log('  Email: jagathraj2k7@gmail.com');
    console.log('  Password: password123\n');
    
    console.log('  Email: nsnamasivayen@gmail.com');
    console.log('  Password: password123\n');

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAllPasswords();
