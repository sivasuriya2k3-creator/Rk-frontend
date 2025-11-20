import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './server/models/User.js';

const fixUserPasswords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/golden-creative-hub');
    console.log('Connected to MongoDB\n');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    // Default password for all users
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Update each user
    for (const user of users) {
      // Check if user already has a password
      if (user.password) {
        console.log(`✓ ${user.name} (${user.email}) - Already has password`);
      } else {
        user.password = hashedPassword;
        await user.save();
        console.log(`✓ ${user.name} (${user.email}) - Password set to: ${defaultPassword}`);
      }
    }

    // Set specific password for admin
    const adminUser = await User.findOne({ email: 'rajkayal7281@gmail.com' });
    if (adminUser) {
      const adminPassword = 'admin123';
      const adminSalt = await bcrypt.genSalt(10);
      const adminHash = await bcrypt.hash(adminPassword, adminSalt);
      adminUser.password = adminHash;
      await adminUser.save();
      console.log(`\n✓ Admin password set to: ${adminPassword}`);
    }

    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('\nAdmin Account:');
    console.log('  Email: rajkayal7281@gmail.com');
    console.log('  Password: admin123');
    console.log('\nRegular Users:');
    console.log('  Email: sivasuriyanraja569@gmail.com');
    console.log('  Password: password123');
    console.log('\n  Email: jagathraj2k7@gmail.com');
    console.log('  Password: password123');
    console.log('\n  Email: nsnamasivayen@gmail.com');
    console.log('  Password: password123');

    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserPasswords();
