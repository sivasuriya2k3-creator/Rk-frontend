# Gmail App Password Setup Guide

## 📧 How to Get Your Gmail App Password

Follow these steps to generate an App Password for sending OTPs to rajkayal7281@gmail.com:

### Step 1: Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Scroll down to "How you sign in to Google"
3. Click "2-Step Verification"
4. Follow the steps to enable it (if not already enabled)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   
   OR
   
   - Go to https://myaccount.google.com
   - Click "Security" in the left menu
   - Scroll to "How you sign in to Google"
   - Click "2-Step Verification"
   - Scroll to bottom and click "App passwords"

2. You might be asked to sign in again

3. In "Select app" dropdown: Choose **"Mail"**

4. In "Select device" dropdown: Choose **"Other (Custom name)"**
   - Type: **"RajKayal OTP System"**

5. Click **"Generate"**

6. You'll see a 16-character password like: `abcd efgh ijkl mnop`

7. **IMPORTANT**: Copy this password and remove the spaces
   - Copy: `abcd efgh ijkl mnop`
   - Use: `abcdefghijklmnop` (no spaces)

### Step 3: Update Your .env File

1. Open `.env` file in your project root

2. Find the line:
   ```
   EMAIL_PASSWORD=your-app-password-here
   ```

3. Replace it with your app password (no spaces):
   ```
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

4. Save the file

### Step 4: Restart Server & Test

1. Stop your server (Ctrl+C)

2. Start it again:
   ```powershell
   npm run server
   ```

3. Test the email system:
   ```powershell
   node server/test-otp.js
   ```

4. You should see:
   ```
   📧 Using Gmail for sending OTP emails
   ✅ OTP Email sent successfully!
   📮 Email sent via Gmail to: rajkayal7281@gmail.com
   📱 Check your inbox!
   ```

5. **Check your Gmail inbox** for the OTP email! 📬

### Step 5: Test Login

1. Start both servers:
   ```powershell
   # Terminal 1
   npm run server
   
   # Terminal 2
   npm run dev
   ```

2. Go to login page and use admin credentials

3. **Check Gmail for OTP** instead of server console

4. Enter the 6-digit code

5. ✅ Done!

---

## ❓ Troubleshooting

### "Can't find App Passwords option"
- Make sure 2-Factor Authentication is enabled first
- Try this direct link: https://myaccount.google.com/apppasswords

### "Invalid credentials" error
- Make sure you removed all spaces from the app password
- Should be exactly 16 characters
- Try generating a new app password

### "Still using Ethereal"
- Check if EMAIL_PASSWORD in .env is updated
- Make sure you restarted the server after updating .env
- Password should not be "your-app-password-here"

### "Email not received"
- Check spam/junk folder
- Wait 1-2 minutes
- Try running `node server/test-otp.js` to verify Gmail is working

---

## 🔒 Security Note

- Never commit the .env file with your real app password
- The app password is specific to this application
- You can revoke it anytime from Google Account settings

---

**Once you have your app password, paste it in the .env file and I'll help you test it!**
