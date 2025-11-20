import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

async function testManagementAPI() {
  try {
    console.log('\n=== Testing Management API ===\n');
    
    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'rajkayal7281@gmail.com',
      password: 'admin123'
    });
    
    console.log('Login Response:', {
      success: loginResponse.data.success,
      hasToken: !!loginResponse.data.token,
      user: loginResponse.data.user?.name,
      role: loginResponse.data.user?.role,
      requiresOTP: loginResponse.data.requiresOTP
    });
    
    if (loginResponse.data.requiresOTP) {
      console.log('❌ OTP is still required! Check SKIP_OTP setting.');
      return;
    }
    
    const token = loginResponse.data.token;
    
    if (!token) {
      console.log('❌ No token received!');
      return;
    }
    
    console.log('✅ Login successful! Token received.\n');
    
    // Step 2: Test getting users
    console.log('Step 2: Testing GET /users...');
    try {
      const usersResponse = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Users loaded:', usersResponse.data.length, 'users');
    } catch (err) {
      console.log('❌ Users failed:', err.response?.status, err.response?.data?.error);
    }
    
    // Step 3: Test getting orders
    console.log('\nStep 3: Testing GET /orders/admin/all...');
    try {
      const ordersResponse = await axios.get(`${API_URL}/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Orders loaded:', ordersResponse.data.length, 'orders');
    } catch (err) {
      console.log('❌ Orders failed:', err.response?.status, err.response?.data?.error);
    }
    
    // Step 4: Test getting revenue
    console.log('\nStep 4: Testing GET /revenue/stats...');
    try {
      const revenueResponse = await axios.get(`${API_URL}/revenue/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Revenue loaded:', {
        today: revenueResponse.data.today?.revenue,
        week: revenueResponse.data.week?.revenue,
        month: revenueResponse.data.month?.revenue
      });
    } catch (err) {
      console.log('❌ Revenue failed:', err.response?.status, err.response?.data?.error);
    }
    
    console.log('\n=== Test Complete ===\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data);
    }
  }
}

testManagementAPI();
