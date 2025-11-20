import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('Testing login API...\n');
    
    const testAccounts = [
      { email: 'rajkayal7281@gmail.com', password: 'admin123', role: 'Admin' },
      { email: 'sivasuriyanraja569@gmail.com', password: 'password123', role: 'User' }
    ];
    
    for (const account of testAccounts) {
      console.log(`\n--- Testing ${account.role}: ${account.email} ---`);
      
      try {
        const response = await axios.post('http://localhost:5002/api/auth/login', {
          email: account.email,
          password: account.password
        });
        
        console.log('✅ Login successful!');
        console.log('Response:', {
          success: response.data.success,
          requiresOTP: response.data.requiresOTP,
          hasToken: !!response.data.token,
          user: response.data.user?.name,
          role: response.data.user?.role
        });
      } catch (error) {
        console.log('❌ Login failed!');
        console.log('Error:', error.response?.data?.error || error.message);
      }
    }
    
    console.log('\n=== Test Complete ===');
  } catch (error) {
    console.error('Test error:', error.message);
  }
};

testLogin();
