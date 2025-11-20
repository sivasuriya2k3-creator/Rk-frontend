# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup MongoDB

**For Local MongoDB:**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service

**For MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string

### Step 3: Create `.env` File
Create a file named `.env` in the project root:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/golden-creative-hub

# JWT
JWT_SECRET=super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Step 4: Run the Application

**Option A: Run Everything at Once**
```bash
npm run dev:full
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
npm run server:dev
```

Terminal 2 - Frontend (new terminal):
```bash
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📝 First Steps

### Create Your First Account
1. Go to http://localhost:5173/register
2. Fill in the registration form
3. Click "Register"
4. You'll be logged in automatically

### Make Admin User
To make your account an admin (for managing portfolio):

**Option 1: MongoDB Compass (GUI)**
1. Open MongoDB Compass
2. Connect to your MongoDB
3. Navigate to `golden-creative-hub` → `users`
4. Find your user
5. Change `role` from `"user"` to `"admin"`
6. Save

**Option 2: MongoDB Shell**
```bash
# Open MongoDB shell
mongosh

# Use the database
use golden-creative-hub

# Update user to admin
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Test the Backend API

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "test123456",
    "confirmPassword": "test123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "test123456"
  }'
```

**Get Current User (use token from login):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Submit Contact Form:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Project Inquiry",
    "message": "I am interested in your services"
  }'
```

## 🗂️ Project Structure

```
├── server/                    # Backend
│   ├── index.js              # Server entry point
│   ├── models/               # Database schemas
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   └── middleware/           # Auth middleware
├── src/                       # Frontend
│   ├── lib/                  # API services
│   ├── context/              # Auth context
│   ├── components/           # React components
│   ├── pages/                # Page components
│   └── App.tsx               # Main app
├── package.json              # Dependencies
├── .env                       # Configuration (create this)
└── README files              # Documentation
```

## 🔒 Authentication Features

✅ User registration and login  
✅ Password hashing with bcrypt  
✅ JWT token-based authentication  
✅ Protected API endpoints  
✅ Role-based access control  
✅ Profile management  
✅ Password change  

## 📚 Documentation

- **Full API Docs**: Read `server/README.md`
- **Setup Guide**: Read `BACKEND_SETUP.md`
- **Implementation Details**: Read `IMPLEMENTATION_SUMMARY.md`

## ⚠️ Common Issues

### MongoDB Connection Failed
- Check MongoDB is running: `mongod`
- Check MONGODB_URI in .env is correct
- For Atlas: Check IP whitelist includes your IP

### Port Already in Use
- Change PORT in .env to another number (e.g., 5001)
- Or kill the process using the port

### CORS Errors
- Make sure CLIENT_URL in .env is `http://localhost:5173`
- Clear browser cache and try again

### Token Expired
- Tokens expire after 7 days by default
- User will be automatically logged out
- Just login again

## 🚢 Deployment

Ready to deploy? See `BACKEND_SETUP.md` section "Production Deployment"

## 📞 Need Help?

Check these files for detailed information:
1. `server/README.md` - Complete API documentation
2. `BACKEND_SETUP.md` - Detailed setup instructions
3. `IMPLEMENTATION_SUMMARY.md` - Overview of what was added

---

**You're all set! Start building! 🎉**
