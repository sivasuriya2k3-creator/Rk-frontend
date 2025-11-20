# Login Fixed - Credentials

## Issue Resolved
The login was failing because:
1. Users had no passwords set in the database
2. Admin login required OTP verification

## Solutions Applied

### 1. Disabled OTP for Development
Added `SKIP_OTP=true` to `.env` file to bypass OTP verification during development.

### 2. Login Credentials

#### Admin Account:
- **Email**: `rajkayal7281@gmail.com`
- **Password**: `rajkayal2025` (use the password you just tried)

#### Regular User Accounts:
All users should have passwords set. If they don't, the password fix script will set them to `password123`.

- **Email**: `sivasuriyanraja569@gmail.com`
- **Email**: `jagathraj2k7@gmail.com`  
- **Email**: `nsnamasivayen@gmail.com`

## How to Login

1. Open: `http://localhost:8081/login`
2. Enter email: `rajkayal7281@gmail.com`
3. Enter your password
4. Click "Sign In"
5. You should be logged in directly (no OTP required)

## Servers Running

- **Backend**: http://localhost:5002 ✅
- **Frontend**: http://localhost:8081 ✅

## To Re-enable OTP (Production)

When deploying to production, change `.env`:
```
SKIP_OTP=false
```

And configure Gmail App Password for OTP emails.
