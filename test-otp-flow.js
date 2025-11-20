import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

async function testOTPFlow() {
  try {
    console.log('\n═══════════════════════════════════════');
    console.log('   Testing OTP Authentication Flow');
    console.log('═══════════════════════════════════════\n');
    
    // Step 1: Try to login as admin (should trigger OTP)
    console.log('Step 1: Logging in as admin...');
    console.log('Email: rajkayal7281@gmail.com');
    console.log('Password: admin123\n');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'rajkayal7281@gmail.com',
      password: 'admin123'
    });
    
    console.log('Login Response:', {
      success: loginResponse.data.success,
      requiresOTP: loginResponse.data.requiresOTP,
      message: loginResponse.data.message
    });
    
    if (!loginResponse.data.requiresOTP) {
      console.log('\n❌ ERROR: OTP should be required but it was not!');
      console.log('Check that SKIP_OTP=false in .env file');
      return;
    }
    
    console.log('\n✅ OTP is required! Check the server terminal for OTP code.');
    console.log('   The OTP will be displayed like this:');
    console.log('   ╔════════════════════════════════════════╗');
    console.log('   ║         OTP GENERATED                  ║');
    console.log('   ╠════════════════════════════════════════╣');
    console.log('   ║  OTP Code: 123456                      ║');
    console.log('   ╚════════════════════════════════════════╝\n');
    
    if (loginResponse.data.previewUrl) {
      console.log('📧 Email Preview URL (Ethereal):');
      console.log('   ' + loginResponse.data.previewUrl);
      console.log('   (Open this URL to see the OTP email)\n');
    }
    
    console.log('═══════════════════════════════════════');
    console.log('   OTP Test Complete');
    console.log('═══════════════════════════════════════');
    console.log('\nNext Steps:');
    console.log('1. Check the server terminal for the OTP code');
    console.log('2. Open http://localhost:8081/login in browser');
    console.log('3. Login with admin credentials');
    console.log('4. You will be redirected to OTP verification page');
    console.log('5. Enter the OTP from server terminal');
    console.log('6. You will be logged in successfully!\n');
    
    // Test resend OTP
    console.log('\nStep 2: Testing Resend OTP...');
    const resendResponse = await axios.post(`${API_URL}/auth/resend-otp`, {
      email: 'rajkayal7281@gmail.com'
    });
    
    console.log('✅ Resend OTP works!');
    console.log('   Check server terminal for new OTP code.\n');
    
    if (resendResponse.data.previewUrl) {
      console.log('📧 New Email Preview URL:');
      console.log('   ' + resendResponse.data.previewUrl + '\n');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data);
    }
  }
}

testOTPFlow();
