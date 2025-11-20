import dotenv from 'dotenv';
import { sendOTPEmail } from './utils/emailService.js';

dotenv.config();

const testOTP = async () => {
  console.log('🧪 Testing OTP Email System\n');
  
  // Generate test OTP
  const testOTP = '123456';
  const testEmail = process.env.EMAIL_USER || 'test@example.com';
  
  console.log(`📧 Sending OTP to: ${testEmail}`);
  console.log(`🔢 OTP Code: ${testOTP}\n`);
  
  try {
    const result = await sendOTPEmail(testEmail, testOTP);
    
    console.log('\n✅ OTP Email sent successfully!');
    console.log('📬 Message ID:', result.messageId);
    
    if (result.previewUrl) {
      console.log('\n🌐 Preview URL (Ethereal Test):');
      console.log(result.previewUrl);
      console.log('\n💡 Open this URL in your browser to see the email');
    } else {
      console.log('\n📮 Email sent via Gmail to:', testEmail);
      console.log('📱 Check your inbox!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to send OTP email:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check EMAIL_PASSWORD in .env file');
    console.error('2. Make sure you created a Gmail App Password');
    console.error('3. Verify EMAIL_USER is correct');
    process.exit(1);
  }
};

testOTP();
