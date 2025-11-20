import mongoose from 'mongoose';
import User from './server/models/User.js';
import Order from './server/models/Order.js';

const MONGODB_URI = 'mongodb://localhost:27017/golden-creative-hub';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check Users
    console.log('=== USERS COLLECTION ===');
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}, Active: ${user.isActive !== false}`);
    });

    // Check Orders
    console.log('\n=== ORDERS COLLECTION ===');
    const orders = await Order.find({}).populate('user', 'name email');
    console.log(`Found ${orders.length} orders:`);
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.service} - ₹${order.budget} - Status: ${order.status}`);
      console.log(`   User: ${order.user ? order.user.name : 'No user linked'}`);
    });

    // Check Projects
    console.log('\n=== PROJECTS COLLECTION ===');
    const Project = mongoose.model('Project', new mongoose.Schema({}, { strict: false }));
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects`);
    if (projects.length > 0) {
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title || project.name || 'Unnamed'}`);
      });
    }

    // Check Employees
    console.log('\n=== EMPLOYEES COLLECTION ===');
    const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
    const employees = await Employee.find({});
    console.log(`Found ${employees.length} employees`);
    if (employees.length > 0) {
      employees.forEach((employee, index) => {
        console.log(`${index + 1}. ${employee.name}`);
      });
    }

    // List all collections
    console.log('\n=== ALL COLLECTIONS IN DATABASE ===');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', '));

    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Users: ${users.length}`);
    console.log(`Orders: ${orders.length}`);
    console.log(`Projects: ${projects.length}`);
    console.log(`Employees: ${employees.length}`);

    // Check if users have isActive field
    console.log('\n=== USER FIELD CHECK ===');
    if (users.length > 0) {
      const sampleUser = users[0];
      console.log('Sample user fields:', Object.keys(sampleUser.toObject()));
      console.log('Has isActive field:', 'isActive' in sampleUser.toObject());
      console.log('Has phone field:', 'phone' in sampleUser.toObject());
    }

    // Check if orders have proper user references
    console.log('\n=== ORDER USER REFERENCES ===');
    if (orders.length > 0) {
      const ordersWithoutUser = orders.filter(o => !o.user);
      const ordersWithUser = orders.filter(o => o.user);
      console.log(`Orders with user reference: ${ordersWithUser.length}`);
      console.log(`Orders without user reference: ${ordersWithoutUser.length}`);
      
      if (ordersWithoutUser.length > 0) {
        console.log('\n⚠️ WARNING: Some orders don\'t have user references!');
        console.log('These orders won\'t show up in user statistics.');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

checkDatabase();
