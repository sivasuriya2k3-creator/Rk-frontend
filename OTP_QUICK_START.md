# 🚀 Quick Start - Admin Login with OTP

## ✅ Current Status: OTP System is WORKING!

The OTP system is fully functional and ready to use. You have 2 options:

---

## 🎯 **Option 1: Test Mode (No Setup Required)**

The system automatically uses **Ethereal** (fake SMTP) for testing. This works out of the box!

### How to Test:

1. **Start the servers:**
   ```powershell
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Login as admin:**
   - Go to: http://localhost:8080/login
   - Email: `rajkayal7281@gmail.com`
   - Password: `rajkayal2025`
   - Click "Login"

3. **Get the OTP:**
   - Check your **server console** (Terminal 1)
   - Look for a URL like: `https://ethereal.email/message/...`
   - Open that URL in your browser to see the OTP email
   - Copy the 6-digit OTP code

4. **Enter OTP:**
   - Paste the 6-digit code in the verification screen
   - Click "Verify OTP"
   - ✅ You're logged in!

---

## 📧 **Option 2: Real Gmail (For Production)**

To send OTP to your actual Gmail inbox:

### Setup Steps:

1. **Generate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Enable 2-Factor Authentication (if not enabled)
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other" → Type "RajKayal OTP"
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

2. **Update .env file:**
   ```env
   EMAIL_PASSWORD=abcdabcdabcdabcd
   ```
   Replace `abcdabcdabcdabcd` with your actual app password

3. **Restart the server:**
   ```powershell
   # Press Ctrl+C to stop server
   npm run server
   ```

4. **Test:**
   - Login again
   - Check your Gmail inbox for the OTP email! 📬

---

## 🧪 Test Email System Anytime

Run this command to test if OTP emails are working:

```powershell
node server/test-otp.js
```

You'll see either:
- ✅ Preview URL for test email (Ethereal)
- ✅ "Email sent via Gmail" message

---

## 🔐 Admin Credentials

- **Email:** rajkayal7281@gmail.com
- **Password:** rajkayal2025
- **Role:** admin
- **Security:** OTP verification required

---

## 📊 Server Console Messages

When you login, you should see:

```
Login attempt: { email: 'rajkayal7281@gmail.com', ... }
User found: { email: '...', hasPassword: true }
Password match result: true
Admin login detected, generating OTP
⚠️ Gmail not configured - Using Ethereal (test email)
OTP Email sent: { messageId: '...', preview: 'https://ethereal.email/...' }
```

The **preview URL** is your OTP email!

---

## ❓ Troubleshooting

### "OTP not working"
- ✅ **It IS working!** Check server console for the preview URL
- Open the URL in browser to see the OTP email

### "Can't see OTP in terminal"
- Scroll up in the server terminal
- Look for `https://ethereal.email/message/...`

### "Want real Gmail"
- Follow Option 2 steps above
- Make sure to restart server after updating .env

### "OTP expired"
- OTPs expire after 10 minutes
- Click "Resend OTP" on the verification screen

---

## 🎉 That's It!

Your OTP system is ready! Start the servers and try logging in as admin.

**Need help?** Check the server console for detailed logs!
