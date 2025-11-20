import mongoose from 'mongoose';
import User from './server/models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/golden-creative-hub';

async function updateUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    console.log('=== UPDATING USERS ===');
    
    // Add phone field to all users that don't have it
    const result = await User.updateMany(
      { phone: { $exists: false } },
      { $set: { phone: '' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users with phone field`);

    // Verify all users
    const users = await User.find({});
    console.log('\nAll users after update:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone || '(not set)'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log('');
    });

    console.log('✓ Users updated successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

updateUsers();
