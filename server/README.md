# Backend API Documentation

## Overview
This is a Node.js/Express backend for the Golden Creative Hub portfolio website with MongoDB database and JWT authentication.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Middleware**: CORS, Express JSON

## Project Structure

```
server/
├── index.js                      # Main application entry point
├── models/                       # Database schemas
│   ├── User.js                   # User schema with auth
│   ├── Portfolio.js              # Portfolio items schema
│   └── Contact.js                # Contact messages schema
├── routes/                       # API route handlers
│   ├── auth.js                   # Authentication routes
│   ├── portfolio.js              # Portfolio routes
│   └── contact.js                # Contact routes
├── controllers/                  # Business logic
│   ├── authController.js         # Auth logic
│   ├── portfolioController.js    # Portfolio logic
│   └── contactController.js      # Contact logic
└── middleware/                   # Custom middleware
    └── auth.js                   # JWT verification & authorization
```

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run server:dev

# Start production server
npm run server
```

## Environment Variables

```env
PORT=5000                          # Server port
NODE_ENV=development              # Environment
MONGODB_URI=mongodb://...          # MongoDB connection string
JWT_SECRET=your_secret_key         # JWT signing secret
JWT_EXPIRE=7d                      # Token expiration
CLIENT_URL=http://localhost:5173   # Frontend URL for CORS
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "confirmPassword": "securepass123"
}

Response: 201
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

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response: 200
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

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Profile
```
PUT /api/auth/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response: 200
{
  "success": true,
  "user": {...}
}
```

#### Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}

Response: 200
{
  "success": true,
  "message": "Password updated successfully",
  "token": "new_token_here"
}
```

### Portfolio Endpoints

#### Get All Portfolio Items
```
GET /api/portfolio?category=Web%20Design&featured=true

Response: 200
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "E-commerce Website",
      "description": "Modern e-commerce platform",
      "category": "Web Design",
      "image": "https://example.com/image.jpg",
      "link": "https://example.com",
      "technologies": ["React", "Node.js", "MongoDB"],
      "featured": true,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Single Portfolio Item
```
GET /api/portfolio/507f1f77bcf86cd799439011

Response: 200
{
  "success": true,
  "data": {...}
}
```

#### Create Portfolio Item (Admin Only)
```
POST /api/portfolio
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "category": "Web Design",
  "image": "https://example.com/image.jpg",
  "link": "https://example.com",
  "technologies": ["React", "TypeScript"],
  "featured": true
}

Response: 201
{
  "success": true,
  "data": {...}
}
```

#### Update Portfolio Item (Admin Only)
```
PUT /api/portfolio/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "featured": false
}

Response: 200
{
  "success": true,
  "data": {...}
}
```

#### Delete Portfolio Item (Admin Only)
```
DELETE /api/portfolio/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "Portfolio item deleted successfully"
}
```

### Contact Endpoints

#### Send Contact Message
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "I'm interested in your services"
}

Response: 201
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Inquiry",
    "message": "I'm interested in your services",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All Contact Messages (Admin Only)
```
GET /api/contact?status=new
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### Get Single Contact Message (Admin Only)
```
GET /api/contact/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "data": {...}
}
```

#### Update Contact Status (Admin Only)
```
PUT /api/contact/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "replied"
}

Response: 200
{
  "success": true,
  "data": {...}
}
```

#### Delete Contact Message (Admin Only)
```
DELETE /api/contact/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "Contact message deleted successfully"
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Portfolio Model
```javascript
{
  title: String (required),
  description: String (required),
  category: String (required, enum: ['Web Design', 'Branding', 'Photography', 'UI/UX', 'Development', 'Other']),
  image: String (required),
  link: String,
  technologies: [String],
  featured: Boolean (default: false),
  createdBy: ObjectId (User reference, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  message: String (required),
  subject: String (required),
  status: String (enum: ['new', 'read', 'replied'], default: 'new'),
  createdAt: Date
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Middleware

### Auth Middleware (`protect`)
Verifies JWT token and extracts user information.

```javascript
import { protect } from './middleware/auth.js';

router.get('/protected-route', protect, controller);
```

### Authorization Middleware (`authorize`)
Checks user role for specific access.

```javascript
import { authorize } from './middleware/auth.js';

router.delete('/portfolio/:id', protect, authorize('admin'), deletePortfolio);
```

## Running the Server

```bash
# Development with auto-reload
npm run server:dev

# Production
npm run server
```

Server will start on `http://localhost:5000`

## Database Connection

### Local MongoDB
```
mongodb://localhost:27017/golden-creative-hub
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/golden-creative-hub
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **Password Hashing**: All passwords are hashed with bcryptjs
3. **JWT Secret**: Use a strong, random secret in production
4. **CORS**: Configure allowed origins in production
5. **Validation**: All inputs are validated before processing
6. **Error Messages**: Generic error messages in production to avoid leaking information

## Performance Considerations

1. Database indexes on frequently queried fields
2. JWT token caching in frontend
3. CORS preflight optimization
4. Mongoose lean queries for read operations

## Future Enhancements

- [ ] Email notifications
- [ ] Password reset functionality
- [ ] File upload for portfolio images
- [ ] Rate limiting
- [ ] Logging system
- [ ] API documentation with Swagger
- [ ] Unit tests
- [ ] Integration tests
