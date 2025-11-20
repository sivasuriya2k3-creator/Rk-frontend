# Backend Setup Guide

## Overview
This application now has a MongoDB backend with JWT authentication. Here's how to set everything up.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

#### Backend (.env)
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/golden-creative-hub
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/golden-creative-hub
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- The app will connect to `mongodb://localhost:27017/golden-creative-hub`

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get your connection string
- Update MONGODB_URI in .env file

### 4. Run the Application

**Development Mode (Run both frontend and backend):**
```bash
npm run dev:full
```

**Or run separately:**

Terminal 1 - Backend:
```bash
npm run server:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 5. API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/update` - Update profile (requires token)
- `PUT /api/auth/change-password` - Change password (requires token)

#### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio/:id` - Get single item
- `POST /api/portfolio` - Create item (admin only)
- `PUT /api/portfolio/:id` - Update item (admin only)
- `DELETE /api/portfolio/:id` - Delete item (admin only)

#### Contact
- `POST /api/contact` - Send contact message (public)
- `GET /api/contact` - Get all messages (admin only)
- `GET /api/contact/:id` - Get single message (admin only)
- `PUT /api/contact/:id` - Update message status (admin only)
- `DELETE /api/contact/:id` - Delete message (admin only)

### 6. Frontend Pages

- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/admin` - Admin dashboard (protected)

### 7. Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically sent with every API request
5. If token expires, user is redirected to login

### 8. User Roles

- **user**: Basic user role
- **admin**: Can manage portfolio and view contacts

To create an admin user, you need to:
1. Register normally
2. Update user role in MongoDB directly OR
3. Modify the database to set role to 'admin'

### 9. Folder Structure

```
├── server/
│   ├── index.js                 # Main server file
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   └── contact.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   └── contactController.js
│   └── middleware/
│       └── auth.js
├── src/
│   ├── lib/
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── authService.ts
│   │   ├── portfolioService.ts
│   │   └── contactService.ts
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── AdminDashboard.tsx
│   └── App.tsx
└── .env                         # Environment variables
```

### 10. Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB service is running
- Check MONGODB_URI in .env is correct
- For local: `mongodb://localhost:27017`
- For Atlas: Check IP whitelist and credentials

**CORS Error:**
- Ensure CLIENT_URL in backend .env matches your frontend URL
- Default is `http://localhost:5173`

**Authentication Errors:**
- Clear localStorage and try again
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in Authorization header

### 11. Production Deployment

Before deploying:
1. Change NODE_ENV to 'production'
2. Use strong JWT_SECRET
3. Update CLIENT_URL to your production frontend URL
4. Use MongoDB Atlas instead of local
5. Set proper CORS origins
6. Use environment variables from hosting provider

## Security Notes

1. Never commit `.env` file with secrets
2. Always use HTTPS in production
3. Store passwords hashed with bcrypt
4. Validate all inputs on backend
5. Use strong JWT secrets
6. Keep dependencies updated

## Next Steps

1. Update the Contact component to use contactService
2. Integrate portfolio display with portfolioService
3. Add admin panel for managing portfolio items
4. Implement email notifications for contacts
5. Add password reset functionality
