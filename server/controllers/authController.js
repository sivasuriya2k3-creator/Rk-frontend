import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    console.log('Register attempt:', { name, email, phone, passwordLength: password?.length });

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    console.log('User created successfully:', { email: user.email, id: user._id });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found:', { email: user.email, hasPassword: !!user.password });

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin - if yes, check if OTP should be skipped
    const skipOTP = process.env.SKIP_OTP === 'true' || process.env.NODE_ENV === 'development';
    
    console.log('OTP Check:', { 
      isAdmin: user.role === 'admin', 
      skipOTP, 
      SKIP_OTP_env: process.env.SKIP_OTP,
      NODE_ENV: process.env.NODE_ENV 
    });
    
    // If admin and OTP not skipped, require OTP verification
    if (user.role === 'admin' && !skipOTP) {
      console.log('Admin login detected, generating OTP');
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Display OTP in terminal with colors and emphasis
      console.log('\n\n');
      console.log('═══════════════════════════════════════════════════');
      console.log('                 🔐 OTP GENERATED 🔐               ');
      console.log('═══════════════════════════════════════════════════');
      console.log('');
      console.log(`   📧 Email: ${user.email}`);
      console.log('');
      console.log(`   🔢 OTP CODE: ${otp}`);
      console.log('');
      console.log('   ⏰ Valid for: 10 minutes');
      console.log('');
      console.log('═══════════════════════════════════════════════════');
      console.log('\n\n');
      
      // Delete any existing OTPs for this email
      await OTP.deleteMany({ email: user.email });
      
      // Save OTP to database
      await OTP.create({
        email: user.email,
        otp: otp
      });
      
      // Try to send OTP via email, but don't fail if email service is down
      let emailSent = false;
      let previewUrl = null;
      
      try {
        const emailResult = await sendOTPEmail(user.email, otp);
        console.log('OTP email sent successfully:', emailResult);
        emailSent = true;
        previewUrl = emailResult.previewUrl;
      } catch (emailError) {
        console.error('Failed to send OTP email (non-critical):', emailError);
        console.log('⚠️  OTP email failed, but user can still see OTP in console/terminal');
      }
      
      // Return success regardless of email send status
      return res.status(200).json({
        success: true,
        requiresOTP: true,
        message: emailSent 
          ? 'OTP has been sent to your email' 
          : 'OTP generated. Check server console for the code.',
        email: user.email,
        previewUrl: previewUrl // For testing with ethereal
      });
    }
    
    // OTP is skipped (development mode) or user is not admin
    if (skipOTP && user.role === 'admin') {
      console.log('⚠️  OTP verification SKIPPED for admin (SKIP_OTP=true)');
    }

    // Generate token and proceed with normal login
    const token = generateToken(user._id, user.role);

    console.log('Login successful for:', email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Verify OTP for admin login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    console.log('OTP verification attempt:', { email, otp, timestamp: new Date().toISOString() });

    if (!email || !otp) {
      return res.status(400).json({ error: 'Please provide email and OTP' });
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });

    console.log('OTP record found:', otpRecord ? {
      email: otpRecord.email,
      otp: otpRecord.otp,
      createdAt: otpRecord.createdAt,
      verified: otpRecord.verified,
      attempts: otpRecord.attempts,
      ageInSeconds: Math.floor((Date.now() - otpRecord.createdAt.getTime()) / 1000)
    } : 'null');

    if (!otpRecord) {
      console.log('Invalid OTP for:', email);
      console.log('Checking all OTP records for this email...');
      const allOtps = await OTP.find({ email }).sort({ createdAt: -1 });
      console.log('All OTPs for email:', allOtps.map(o => ({
        otp: o.otp,
        createdAt: o.createdAt,
        ageInSeconds: Math.floor((Date.now() - o.createdAt.getTime()) / 1000)
      })));
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Check if OTP is already verified
    if (otpRecord.verified) {
      return res.status(400).json({ error: 'OTP already used' });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ error: 'Too many attempts. Please request a new OTP' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(401).json({ 
        error: 'Invalid OTP',
        attemptsLeft: 5 - otpRecord.attempts 
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Get user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    console.log('OTP verified successfully for:', email);

    // Delete the OTP record after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide email' });
    }

    // Check if user exists and is admin
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Display OTP in terminal
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║      OTP RESENT                        ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  Email: ${email.padEnd(28)} ║`);
    console.log(`║  OTP Code: ${otp}                       ║`);
    console.log('╚════════════════════════════════════════╝\n');

    // Delete old OTPs
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp });

    // Send OTP via email
    try {
      const emailResult = await sendOTPEmail(email, otp);
      
      res.status(200).json({
        success: true,
        message: 'New OTP has been sent to your email',
        previewUrl: emailResult.previewUrl
      });
    } catch (emailError) {
      console.error('Failed to resend OTP:', emailError);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};
