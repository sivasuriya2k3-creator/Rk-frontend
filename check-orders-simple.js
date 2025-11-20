// Simple MongoDB query to check orders
const { MongoClient } = require('mongodb');

async function checkOrders() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('golden-creative-hub');
    const orders = db.collection('orders');
    
    // Get all orders
    const allOrders = await orders.find({}).toArray();
    console.log(`Total orders: ${allOrders.length}\n`);
    
    // Display each order
    allOrders.forEach((order, i) => {
      console.log(`Order ${i + 1}:`);
      console.log(`  Service: ${order.service}`);
      console.log(`  Budget: ₹${order.budget?.toLocaleString('en-IN')}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Created: ${order.createdAt}`);
      console.log(`  Completed: ${order.completedDate || 'Not completed yet'}\n`);
    });
    
    // Get completed orders
    const completed = await orders.find({ status: 'completed' }).toArray();
    console.log(`\nCompleted orders: ${completed.length}`);
    
    if (completed.length > 0) {
      const total = completed.reduce((sum, o) => sum + (o.budget || 0), 0);
      console.log(`Total revenue from completed orders: ₹${total.toLocaleString('en-IN')}`);
    } else {
      console.log('\n⚠️  No completed orders found!');
      console.log('To see revenue, you need to mark orders as "completed" in the admin dashboard.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkOrders();
