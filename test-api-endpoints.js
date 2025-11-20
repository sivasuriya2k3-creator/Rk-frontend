// Test API endpoints
const API_BASE = 'http://localhost:5002/api';

async function testAPIs() {
  console.log('=== Testing API Endpoints ===\n');

  // Get token from command line argument or use a default
  const token = process.argv[2];
  
  if (!token) {
    console.log('❌ Please provide admin token as argument');
    console.log('Usage: node test-api-endpoints.js YOUR_TOKEN_HERE');
    console.log('\nTo get your token:');
    console.log('1. Login to the app as admin');
    console.log('2. Open browser console');
    console.log('3. Run: localStorage.getItem("token")');
    console.log('4. Copy the token and run this script again');
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    // Test Health
    console.log('1️⃣ Testing Health Endpoint...');
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    console.log('✅ Health:', health);

    // Test Users
    console.log('\n2️⃣ Testing Users API...');
    const usersRes = await fetch(`${API_BASE}/users`, { headers });
    console.log('Status:', usersRes.status, usersRes.statusText);
    const users = await usersRes.json();
    console.log('✅ Users Response:', JSON.stringify(users, null, 2));

    // Test User Stats
    console.log('\n3️⃣ Testing User Stats API...');
    const statsRes = await fetch(`${API_BASE}/users/stats`, { headers });
    console.log('Status:', statsRes.status, statsRes.statusText);
    const stats = await statsRes.json();
    console.log('✅ User Stats:', JSON.stringify(stats, null, 2));

    // Test Orders
    console.log('\n4️⃣ Testing Orders API...');
    const ordersRes = await fetch(`${API_BASE}/orders/admin/all`, { headers });
    console.log('Status:', ordersRes.status, ordersRes.statusText);
    const orders = await ordersRes.json();
    console.log('✅ Orders Response:', JSON.stringify(orders, null, 2));

    // Test Revenue
    console.log('\n5️⃣ Testing Revenue API...');
    const revenueRes = await fetch(`${API_BASE}/revenue/stats`, { headers });
    console.log('Status:', revenueRes.status, revenueRes.statusText);
    const revenue = await revenueRes.json();
    console.log('✅ Revenue Response:', JSON.stringify(revenue, null, 2));

    console.log('\n✅ All API tests completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPIs();
