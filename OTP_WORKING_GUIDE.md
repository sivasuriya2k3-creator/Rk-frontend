# OTP Authentication System - Working Guide ✅

## Status: **OTP ENABLED AND WORKING**

Date: November 12, 2025

---

## 🔐 How OTP Works

### For Admin Users:
1. Admin enters email and password on login page
2. System validates credentials
3. If valid, system generates a 6-digit OTP
4. OTP is displayed in **server terminal** (always visible)
5. OTP is sent via email (if configured, or test email)
6. Admin is redirected to OTP verification page
7. Admin enters the 6-digit OTP
8. System validates OTP
9. Admin is logged in successfully

### For Regular Users:
- Regular users login normally without OTP
- No OTP verification required

---

## 📧 Email Configuration

### Current Setup: **Ethereal (Test Email)**

The system is currently using **Ethereal** which is a fake SMTP service for testing.

**Features:**
- ✅ OTP always shown in server terminal
- ✅ Email preview URL provided
- ✅ No real email configuration needed
- ✅ Perfect for development/testing

**How to View Test Emails:**
1. Check server terminal for preview URL
2. Click the URL to open Ethereal inbox
3. View the beautifully formatted OTP email

### To Use Real Gmail (Production):

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to https://myaccount.google.com/security

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" app
   - Generate password (16 characters)

3. **Update .env file**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=rajkayal7281@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

4. **Restart server** to apply changes

---

## 🧪 Testing OTP System

### Method 1: Using Test Script

```bash
cd "c:\Users\sivas\Documents\RK website\RK website"
node test-otp-flow.js
```

**Expected Output:**
```
✅ OTP is required!
📧 Email Preview URL: https://ethereal.email/message/...
✅ Resend OTP works!
```

### Method 2: Browser Testing

1. **Open browser**: http://localhost:8081/login

2. **Enter admin credentials**:
   - Email: `rajkayal7281@gmail.com`
   - Password: `admin123`

3. **Click Login**

4. **You will be redirected to**: http://localhost:8081/verify-otp

5. **Check server terminal** for OTP code:
   ```
   ╔════════════════════════════════════════╗
   ║         OTP GENERATED                  ║
   ╠════════════════════════════════════════╣
   ║  Email: rajkayal7281@gmail.com         ║
   ║  OTP Code: 123456                      ║
   ╚════════════════════════════════════════╝
   ```

6. **Enter the 6-digit OTP** in the verification page

7. **Click Verify**

8. **You will be logged in** and redirected to home page

---

## 🎯 OTP Verification Page Features

### Visual Design:
- ✨ Beautiful gold-themed UI
- 🎨 Matches RajKayal brand identity
- 📱 Responsive design
- ⌨️ Large OTP input boxes (6 digits)

### Functionality:
- ✅ Auto-focus on first input box
- ✅ Auto-advance to next box on type
- ✅ Clear error messages
- ✅ Resend OTP button (60s cooldown)
- ✅ Back to login link
- ✅ Attempt tracking (max 5 attempts)

### Security Features:
- 🔒 OTP expires in 10 minutes
- 🔒 Maximum 5 verification attempts
- 🔒 OTP deleted after successful verification
- 🔒 One-time use only
- 🔒 Cannot reuse verified OTPs

---

## ⚙️ Configuration Options

### Enable/Disable OTP

**File**: `.env`

```env
# Enable OTP (production)
SKIP_OTP=false

# Disable OTP (development only)
SKIP_OTP=true
```

### OTP Expiration Time

**File**: `server/models/OTP.js`

```javascript
createdAt: {
  type: Date,
  default: Date.now,
  expires: 600  // 600 seconds = 10 minutes
}
```

Change `600` to desired seconds:
- 300 = 5 minutes
- 600 = 10 minutes
- 900 = 15 minutes

---

## 🛠️ Troubleshooting

### Issue: "OTP not required even with SKIP_OTP=false"

**Solution:**
1. Verify `.env` file has `SKIP_OTP=false`
2. Restart the server
3. Check server terminal for OTP skip message
4. Clear browser localStorage: `localStorage.clear()`

### Issue: "Cannot see OTP in terminal"

**Solution:**
- OTP is ALWAYS displayed in server terminal
- Look for the box with "OTP GENERATED"
- Check you're looking at the server terminal (not frontend)

### Issue: "Invalid or expired OTP"

**Possible Causes:**
1. OTP expired (10 minutes passed)
2. Wrong OTP entered
3. Too many attempts (5 max)
4. OTP already used

**Solution:**
- Click "Resend OTP" button
- Get new OTP from server terminal
- Try again with new OTP

### Issue: "Email not received"

**Note**: Emails go to **Ethereal (test)** by default
- Check server terminal for preview URL
- Click URL to view email online
- Email is NOT sent to real inbox unless Gmail is configured

---

## 📋 Current Status Checklist

- [x] OTP system enabled (SKIP_OTP=false)
- [x] OTP generation working
- [x] OTP displayed in terminal
- [x] OTP verification endpoint working
- [x] Resend OTP working
- [x] OTP expiration (10 minutes)
- [x] Maximum attempts (5)
- [x] Frontend OTP page exists
- [x] Routes configured
- [x] Email service working (Ethereal)
- [x] Beautiful UI design
- [x] Security features implemented
- [x] Test scripts created

---

## 🚀 Quick Start Commands

### Start Both Servers:
```bash
# Option 1: Use batch file
START_SERVERS.bat

# Option 2: Manual
# Terminal 1 (Backend):
cd "c:\Users\sivas\Documents\RK website\RK website\server"
node index.js

# Terminal 2 (Frontend):
cd "c:\Users\sivas\Documents\RK website\RK website"
npm run dev
```

### Test OTP Flow:
```bash
node test-otp-flow.js
```

### Check Server Status:
```powershell
Get-NetTCPConnection -LocalPort 5002,8081 | Select-Object State, LocalPort
```

---

## 📝 Login Credentials

### Admin (Requires OTP):
- **Email**: rajkayal7281@gmail.com
- **Password**: admin123
- **OTP**: Check server terminal after login

### Regular Users (No OTP):
- **Email**: sivasuriyanraja@gmail.com
- **Password**: password123
- (No OTP required)

---

## 🎨 OTP Email Template

The OTP email includes:
- ✨ RajKayal branding and logo
- 🎨 Gold gradient design
- 📱 Responsive layout
- 🔢 Large OTP display
- ⏱️ Expiration notice (10 minutes)
- ⚠️ Security warning
- 📧 Professional footer

---

## 💡 Best Practices

1. **Development**: Use Ethereal (current setup)
   - No email configuration needed
   - View emails via preview URL
   - OTP always in terminal

2. **Production**: Configure Gmail
   - Use App Passwords (not account password)
   - Enable 2-Factor Authentication
   - Monitor email sending limits

3. **Security**:
   - Never share OTP codes
   - Don't disable OTP in production
   - Use strong JWT_SECRET
   - Monitor failed attempts

---

## 📞 Support

If OTP is not working:
1. Check `.env` file: `SKIP_OTP=false`
2. Restart server
3. Check server terminal for errors
4. Run test script: `node test-otp-flow.js`
5. Clear browser cache and localStorage

---

**✅ OTP System Status: FULLY OPERATIONAL**

All tests passing | Email sending working | Security enabled
