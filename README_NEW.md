# Golden Creative Hub - Full Stack Application

A modern, full-stack creative portfolio website with user authentication, MongoDB database, and admin panel.

## 🌟 Features

### ✨ Core Features
- **User Authentication**: Secure registration, login, and profile management with JWT
- **Portfolio Management**: Create, read, update, delete portfolio items (admin only)
- **Contact Management**: Handle contact form submissions with status tracking
- **Role-Based Access Control**: User and Admin roles with different permissions
- **Responsive Design**: Beautiful UI with Tailwind CSS and shadcn/ui components
- **Modern Stack**: React 18 + TypeScript + Vite on frontend, Node.js + Express on backend

### 🔐 Security Features
- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- CORS protection
- Input validation
- Role-based authorization

### 📊 Database Features
- MongoDB with Mongoose ODM
- Data validation
- Automatic timestamps
- Efficient indexing
- User references and relationships

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn**

### 5-Minute Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
node setup.js
# Or create .env manually:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/golden-creative-hub
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:5173

# 3. Start the application
npm run dev:full

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

That's it! 🎉

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Fast setup guide (5 minutes) |
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | Detailed backend configuration |
| [server/README.md](./server/README.md) | Complete API documentation |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & diagrams |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | What was implemented |
| [CHECKLIST.md](./CHECKLIST.md) | Implementation & testing checklist |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues & solutions |

## 🏗️ Project Structure

```
golden-creative-hub-main/
│
├── 📁 server/                          # Backend (Node.js/Express)
│   ├── index.js                        # Main server file
│   ├── README.md                       # API documentation
│   ├── 📁 models/                      # Database schemas
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Contact.js
│   ├── 📁 routes/                      # API routes
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   └── contact.js
│   ├── 📁 controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   └── contactController.js
│   └── 📁 middleware/                  # Custom middleware
│       └── auth.js                     # JWT verification
│
├── 📁 src/                             # Frontend (React/TypeScript)
│   ├── App.tsx                         # Main app component
│   ├── main.tsx                        # Entry point
│   ├── 📁 lib/                         # Utilities & services
│   │   ├── api.ts                      # Axios configuration
│   │   ├── authService.ts              # Auth API calls
│   │   ├── portfolioService.ts         # Portfolio API calls
│   │   └── contactService.ts           # Contact API calls
│   ├── 📁 context/                     # State management
│   │   └── AuthContext.tsx             # Auth state
│   ├── 📁 components/                  # React components
│   │   ├── ProtectedRoute.tsx
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── 📁 pages/                       # Page components
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   └── 📁 hooks/                       # Custom hooks
│       └── use-toast.ts
│
├── 📄 package.json                     # Dependencies & scripts
├── 📄 .env                             # Environment variables (create)
├── 📄 .env.example                     # Environment template
├── 📄 setup.js                         # Setup script
│
├── 📄 README.md                        # This file
├── 📄 QUICK_START.md                   # 5-minute setup
├── 📄 BACKEND_SETUP.md                 # Backend configuration
├── 📄 IMPLEMENTATION_SUMMARY.md        # What's included
├── 📄 ARCHITECTURE.md                  # System design
├── 📄 CHECKLIST.md                     # Implementation checklist
└── 📄 TROUBLESHOOTING.md               # Problem solving
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register           # Create new account
POST   /api/auth/login              # Login user
GET    /api/auth/me                 # Get current user (protected)
PUT    /api/auth/update             # Update profile (protected)
PUT    /api/auth/change-password    # Change password (protected)
```

### Portfolio
```
GET    /api/portfolio               # Get all items
GET    /api/portfolio/:id           # Get single item
POST   /api/portfolio               # Create item (admin only)
PUT    /api/portfolio/:id           # Update item (admin only)
DELETE /api/portfolio/:id           # Delete item (admin only)
```

### Contact
```
POST   /api/contact                 # Send contact message (public)
GET    /api/contact                 # Get all messages (admin only)
GET    /api/contact/:id             # Get single message (admin only)
PUT    /api/contact/:id             # Update status (admin only)
DELETE /api/contact/:id             # Delete message (admin only)
```

## 👤 User Roles

### User Role
- Register and login
- View portfolio items
- Submit contact form
- Update own profile

### Admin Role
- All user permissions plus:
- Create/Edit/Delete portfolio items
- View and manage contact messages
- Change message status (new/read/replied)

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start frontend only
npm run server:dev      # Start backend only
npm run dev:full        # Start both (recommended)

# Production
npm run build           # Build frontend
npm run server          # Run backend

# Utilities
npm run lint            # Check code style
npm run preview         # Preview production build

# Setup
node setup.js           # Interactive setup
```

## 📋 Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/golden-creative-hub

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/golden-creative-hub
```

## 🔐 Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. Password hashed and compared
   ↓
4. JWT token generated
   ↓
5. Token sent to frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. Token auto-attached to subsequent requests
   ↓
8. Backend verifies token on protected routes
```

## 💾 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Portfolio
```javascript
{
  title: String,
  description: String,
  category: String,
  image: String (URL),
  link: String (optional),
  technologies: [String],
  featured: Boolean,
  createdBy: ObjectId (User ref),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  phone: String (optional),
  subject: String,
  message: String,
  status: String (new/read/replied),
  createdAt: Date
}
```

## 🔄 Request/Response Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123",
    "confirmPassword": "secure123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### Protected Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)
```bash
npm run build
# Upload dist/ folder
```

### Backend (Heroku, Railway, etc.)
```bash
# Set environment variables on hosting platform
# Push code to git
# Platform auto-deploys
```

### Database (MongoDB Atlas)
- Create cluster on https://www.mongodb.com/cloud/atlas
- Use cluster connection string in production `.env`
- Configure IP whitelist

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] JWT token generated
- [ ] Protected routes work
- [ ] Admin panel accessible (when admin)
- [ ] Contact form submission works
- [ ] Portfolio items load

### API Testing Tools
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client**: https://www.thunderclient.io/

## 📦 Dependencies

### Frontend
- **react**: UI library
- **typescript**: Type safety
- **tailwindcss**: Styling
- **axios**: HTTP client
- **react-router-dom**: Routing
- **zod**: Validation
- **shadcn/ui**: UI components

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT auth
- **bcryptjs**: Password hashing
- **cors**: CORS support
- **dotenv**: Environment variables

## 🐛 Troubleshooting

**MongoDB won't connect?**
→ See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#mongodb-connection-issues)

**CORS errors?**
→ See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#cors-errors)

**Port in use?**
→ See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#port-already-in-use)

**Other issues?**
→ Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for comprehensive solutions

## 📖 Learning Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **JWT**: https://jwt.io/
- **REST API**: https://restfulapi.net/

## 🤝 Contributing

To extend this project:

1. **Add new API endpoints**: Create route in `server/routes/`
2. **Add new pages**: Create component in `src/pages/`
3. **Add new services**: Create service in `src/lib/`
4. **Styling**: Use Tailwind CSS and shadcn/ui

## 📝 License

This project is open source and available for personal and commercial use.

## ✅ Checklist for First Run

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (`mongod` or Atlas)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created (`node setup.js`)
- [ ] Backend starts (`npm run server:dev`)
- [ ] Frontend starts (`npm run dev`)
- [ ] Can access `http://localhost:5173`
- [ ] Can register account
- [ ] Can login successfully
- [ ] Token visible in localStorage

## 🎯 Next Steps

1. **Start Development**: `npm run dev:full`
2. **Register Account**: Visit `/register`
3. **Login**: Visit `/login`
4. **Make Admin**: Update user role in MongoDB
5. **Access Admin Panel**: Visit `/admin`
6. **Manage Portfolio**: Create and edit items
7. **View Contacts**: See contact form submissions

## 📞 Support

For issues, check:
1. [QUICK_START.md](./QUICK_START.md) - Quick setup help
2. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
3. [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend help
4. [server/README.md](./server/README.md) - API reference

---

## 🎉 You're Ready!

Your full-stack application with authentication is ready to use!

**Start building:** `npm run dev:full`

Enjoy! 🚀
