import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = async () => {
  // For development/testing, you can use Gmail
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  
  if (process.env.EMAIL_SERVICE === 'gmail' && process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD !== 'your-app-password-here') {
    console.log('📧 Using Gmail for sending OTP emails');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });
  }
  
  // Fallback to ethereal for testing (creates fake test account automatically)
  console.log('⚠️ Gmail not configured - Using Ethereal (test email)');
  console.log('💡 To use real Gmail: Set EMAIL_PASSWORD in .env with your App Password');
  
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject: 'Your Admin Login OTP - RajKayal Creative Hub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              background-color: #0f0f0f;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              background: linear-gradient(135deg, #D4AF37, #FFD700);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .content {
              background: #1a1a1a;
              border: 1px solid #333;
              border-radius: 12px;
              padding: 40px;
              text-align: center;
            }
            .otp-box {
              background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
              color: #000;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              display: inline-block;
            }
            .message {
              color: #a0a0a0;
              line-height: 1.6;
              margin: 20px 0;
            }
            .warning {
              color: #ff6b6b;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RajKayal</div>
              <p style="color: #a0a0a0;">Creative Hub</p>
            </div>
            
            <div class="content">
              <h2 style="color: #D4AF37; margin-top: 0;">Admin Login Verification</h2>
              
              <p class="message">
                You are attempting to log in to your admin account.<br>
                Please use the following OTP to complete your login:
              </p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="message">
                This code will expire in <strong>5 minutes</strong>.
              </p>
              
              <p class="warning">
                ⚠️ If you did not request this code, please ignore this email<br>
                and ensure your account is secure.
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} RajKayal Creative Hub. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✉️  OTP Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Recipient:', email);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    console.log('');
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send welcome email (optional)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject: 'Welcome to RajKayal Creative Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Welcome, ${name}!</h2>
          <p>Thank you for joining RajKayal Creative Hub.</p>
          <p>We're excited to have you on board!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

export default { sendOTPEmail, sendWelcomeEmail };
