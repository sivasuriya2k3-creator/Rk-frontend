import mongoose from 'mongoose';
import Order from './server/models/Order.js';

const testRevenue = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/golden-creative-hub');
    console.log('Connected to MongoDB');

    // Get all orders
    const allOrders = await Order.find({});
    console.log('\n=== ALL ORDERS ===');
    console.log(`Total orders: ${allOrders.length}`);
    
    allOrders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log(`  ID: ${order._id}`);
      console.log(`  Service: ${order.service}`);
      console.log(`  Title: ${order.title}`);
      console.log(`  Budget: ₹${order.budget?.toLocaleString('en-IN') || 'N/A'}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Created: ${order.createdAt}`);
      console.log(`  Completed Date: ${order.completedDate || 'Not completed'}`);
    });

    // Get completed orders
    const completedOrders = await Order.find({ status: 'completed' });
    console.log('\n=== COMPLETED ORDERS ===');
    console.log(`Total completed orders: ${completedOrders.length}`);
    
    if (completedOrders.length > 0) {
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.budget || 0), 0);
      console.log(`Total Revenue from completed orders: ₹${totalRevenue.toLocaleString('en-IN')}`);
      
      completedOrders.forEach((order, index) => {
        console.log(`\nCompleted Order ${index + 1}:`);
        console.log(`  Service: ${order.service}`);
        console.log(`  Budget: ₹${order.budget?.toLocaleString('en-IN')}`);
        console.log(`  Completed Date: ${order.completedDate}`);
      });
    } else {
      console.log('No completed orders found.');
      console.log('\nTo test revenue calculation, you need to:');
      console.log('1. Mark an order as "completed" from the admin dashboard');
      console.log('2. The revenue will be calculated based on the completedDate');
    }

    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testRevenue();
