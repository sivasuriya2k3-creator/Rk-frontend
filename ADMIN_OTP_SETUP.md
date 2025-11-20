# Admin Login with OTP Setup

## 🎯 Overview
Your admin account `rajkayal7281@gmail.com` now requires OTP verification for enhanced security.

## 📋 Setup Steps

### 1. Install Dependencies
```powershell
npm install
```

### 2. Configure Email Service
You need to set up Gmail App Password for sending OTP emails:

1. **Go to Google Account Settings**: https://myaccount.google.com/apppasswords
2. **Enable 2-Factor Authentication** (if not already enabled)
3. **Generate an App Password**:
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → type "RajKayal OTP"
   - Click "Generate"
   - Copy the 16-character password

4. **Update `.env` file**:
   ```env
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### 3. Create Admin User
Run the setup script to create/update the admin account:

```powershell
cd server
node setup-admin.js
```

This will create the admin user with:
- **Email**: rajkayal7281@gmail.com
- **Password**: rajkayal2025
- **Role**: admin

### 4. Start the Servers

**Start Backend:**
```powershell
npm run server
```

**Start Frontend (in another terminal):**
```powershell
npm run dev
```

## 🔐 Admin Login Flow

### Step 1: Initial Login
1. Go to `/login`
2. Enter credentials:
   - Email: `rajkayal7281@gmail.com`
   - Password: `rajkayal2025`
3. Click "Login"

### Step 2: OTP Verification
1. Check your email (`rajkayal7281@gmail.com`) for the OTP
2. Enter the 6-digit OTP code
3. Click "Verify OTP"
4. You'll be logged in successfully!

## 📧 OTP Email Features
- **Beautiful HTML template** with gold luxury theme
- **6-digit code** displayed prominently
- **10-minute expiration** time
- **Security warning** if not requested

## 🔄 OTP Options
- **Resend OTP**: Click "Resend OTP" to get a new code
- **Back to Login**: Return to login screen
- **Max Attempts**: 5 attempts per OTP

## 🚨 Troubleshooting

### Email not received?
1. Check spam/junk folder
2. Verify EMAIL_PASSWORD in `.env` is correct
3. Check server console for email preview URL (for testing)
4. Make sure Gmail App Password is active

### OTP expired?
- OTPs expire after 10 minutes
- Click "Resend OTP" to get a new code

### Testing without real email?
The system uses Ethereal (fake SMTP) as fallback. Check server console for preview URLs.

## 🎨 Features Implemented

### Backend:
- ✅ OTP model with auto-expiration (10 minutes)
- ✅ Email service with nodemailer
- ✅ OTP generation and verification endpoints
- ✅ Resend OTP functionality
- ✅ Rate limiting (5 attempts)
- ✅ Admin-only OTP requirement

### Frontend:
- ✅ Beautiful OTP input UI with 6 digits
- ✅ Automatic flow detection
- ✅ Resend OTP button
- ✅ Loading states and error handling
- ✅ Back to login option
- ✅ Luxury gold theme

## 📝 API Endpoints

- `POST /api/auth/login` - Initial login (triggers OTP for admin)
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/resend-otp` - Request new OTP

## 🔧 Configuration Files

- `.env` - Email and server configuration
- `server/models/OTP.js` - OTP database model
- `server/utils/emailService.js` - Email sending service
- `server/controllers/authController.js` - Auth logic with OTP
- `src/pages/Login.tsx` - Login UI with OTP verification

## 🎯 Regular Users
Non-admin users log in normally without OTP verification. Only admins require OTP.

---

**Need help?** Check server console logs for detailed information about OTP generation and email delivery.
