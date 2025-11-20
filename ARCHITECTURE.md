# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            React Frontend (Vite)                          │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Auth Context (Global State Management)             │  │  │
│  │  │  - Store user info                                  │  │  │
│  │  │  - Manage authentication status                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ▲                                  │  │
│  │                          │                                  │  │
│  │  ┌──────────┬────────────┼────────────┬──────────┐         │  │
│  │  │          │            │            │          │         │  │
│  │  ▼          ▼            ▼            ▼          ▼         │  │
│  │┌─────────┬──────────┬──────────┬────────────┬──────────┐   │  │
│  ││ Pages   │ Services │Components│ Protected  │   Hooks  │   │  │
│  ││ ·Login  │ ·authSvr │ ·Layout  │ ·Routes    │ ·useAuth │   │  │
│  ││ ·Regstr │ ·portflio│ ·Navbar  │ ·AdminRte  │          │   │  │
│  ││ ·Home   │ ·contact │ ·Footer  │            │          │   │  │
│  │└─────────┴──────────┴──────────┴────────────┴──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                          │                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                    HTTP/REST API
            (axios with JWT interceptors)
                           │
┌──────────────────────────┼────────────────────────────────────────┐
│                          ▼                                         │
│                  BACKEND (Node.js/Express)                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    HTTP Server                           │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │          CORS Middleware                           │  │    │
│  │  │  (Allow requests from http://localhost:5173)       │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  │                          ▼                               │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Route Handlers (/api/...)                       │   │    │
│  │  │  ├── /auth/*        (Register, Login, Profile)  │   │    │
│  │  │  ├── /portfolio/*   (CRUD + Admin)              │   │    │
│  │  │  └── /contact/*     (Form + Admin)              │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                          ▼                               │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Auth Middleware                                 │   │    │
│  │  │  - Verify JWT Token                              │   │    │
│  │  │  - Extract User Info                             │   │    │
│  │  │  - Check Authorization (Admin/User)              │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                          ▼                               │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Controllers (Business Logic)                    │   │    │
│  │  │  - authController.js                             │   │    │
│  │  │  - portfolioController.js                        │   │    │
│  │  │  - contactController.js                          │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                          ▼                               │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Models (Database Schemas)                       │   │    │
│  │  │  ├── User                                        │   │    │
│  │  │  ├── Portfolio                                  │   │    │
│  │  │  └── Contact                                    │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                          ▼                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                   MongoDB Query Language
                           │
┌──────────────────────────┼────────────────────────────────────────┐
│                          ▼                                         │
│                    DATABASE (MongoDB)                             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Collections:                                            │    │
│  │  ├── users          (Registered Users)                   │    │
│  │  │   └── { _id, name, email, password, role, ... }      │    │
│  │  │                                                        │    │
│  │  ├── portfolios     (Creative Projects)                  │    │
│  │  │   └── { _id, title, desc, category, createdBy, ... } │    │
│  │  │                                                        │    │
│  │  └── contacts       (Contact Form Messages)              │    │
│  │      └── { _id, name, email, subject, status, ... }     │    │
│  │                                                           │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────┐
│  User registers │
│   new account   │
└────────┬────────┘
         │
         ▼
   ┌─────────────┐
   │ Frontend    │
   │ POST        │◄──── email, password, name
   │ /auth/      │
   │ register    │
   └──────┬──────┘
          │ HTTP
          ▼
   ┌─────────────┐
   │ Backend     │
   │ Validation  │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Hash pwd    │
   │ with bcrypt │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Save user   │
   │ to MongoDB  │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Generate    │
   │ JWT token   │
   └──────┬──────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Return token + user info│
   │ to Frontend             │
   └──────┬──────────────────┘
          │ HTTP
          ▼
   ┌─────────────────────────┐
   │ Frontend stores token   │
   │ in localStorage         │
   └─────────────────────────┘

   [Subsequent Requests]

┌─────────────────────────┐
│ User makes API request  │
│ (with axios)            │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Request interceptor     │
│ Attaches JWT token      │
│ Authorization: Bearer <token>
└──────────┬──────────────┘
           │ HTTP
           ▼
┌─────────────────────────┐
│ Backend receives request│
│ Auth middleware extracts│
│ JWT from header         │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Verify JWT signature    │
│ Extract user info       │
└──────────┬──────────────┘
           │
     ┌─────┴──────┐
     │             │
  Valid        Invalid
     │             │
     ▼             ▼
  Accept    Return 401
  Request   Unauthorized
     │
     ▼
┌─────────────────────────┐
│ Check user role         │
│ (admin/user)            │
└──────────┬──────────────┘
           │
     ┌─────┴──────┐
     │             │
  Authorized  Forbidden
     │             │
     ▼             ▼
  Proceed     Return 403
  Request     Forbidden
```

## Data Flow Examples

### User Registration
```
Frontend                  Backend           Database
   │                        │                  │
   ├─POST /auth/register───>│                  │
   │                        │                  │
   │                        ├─Validate────────>│
   │                        │<─Validation OK──┤
   │                        │                  │
   │                        ├─Hash Password    │
   │                        │                  │
   │                        ├─Create User────>│
   │                        │<─User Created───┤
   │                        │                  │
   │                        ├─Generate JWT    │
   │                        │                  │
   │<─{token, user}────────┤                  │
   │                        │                  │
   ├─Store token in         │                  │
   │ localStorage           │                  │
   │                        │                  │
```

### Authenticated API Call
```
Frontend                  Backend           Database
   │                        │                  │
   ├─GET /api/portfolio    │                  │
   │ with JWT token        │                  │
   ├───────────────────────>│                  │
   │                        │                  │
   │                        ├─Verify JWT      │
   │                        │                  │
   │                        ├─Check admin     │
   │                        │                  │
   │                        ├─Query────────────>│
   │                        │<─Portfolio data──┤
   │                        │                  │
   │<─{success, data}──────┤                  │
   │                        │                  │
   ├─Update UI with data    │                  │
   │                        │                  │
```

## Component Hierarchy

```
<AuthProvider>
  ├─ App
  │  └─ BrowserRouter
  │     ├─ Routes
  │     │  ├─ Route (/) → <Index>
  │     │  ├─ Route (/login) → <Login>
  │     │  ├─ Route (/register) → <Register>
  │     │  ├─ ProtectedRoute
  │     │  │  └─ Route (/admin) → <AdminDashboard>
  │     │  └─ Route (*) → <NotFound>
  │     │
  │     ├─ Navbar
  │     ├─ Footer
  │     └─ Other Components
  │
  └─ Context Providers
     ├─ ThemeProvider
     ├─ TooltipProvider
     └─ QueryClientProvider
```

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI Library |
| | TypeScript | Type Safety |
| | Vite | Build Tool |
| | Tailwind CSS | Styling |
| | React Router | Navigation |
| | Axios | HTTP Client |
| Backend | Node.js | Runtime |
| | Express.js | Web Framework |
| | MongoDB | Database |
| | Mongoose | ODM |
| | JWT | Authentication |
| | bcryptjs | Password Hashing |
| | CORS | Cross-Origin Support |

## Security Layers

```
┌──────────────────────────────────┐
│  1. CORS Middleware              │
│     (Allow only trusted origins) │
└──────────────────────────────────┘
              ▼
┌──────────────────────────────────┐
│  2. Input Validation             │
│     (Server-side validation)     │
└──────────────────────────────────┘
              ▼
┌──────────────────────────────────┐
│  3. JWT Verification             │
│     (Token signature & expiry)   │
└──────────────────────────────────┘
              ▼
┌──────────────────────────────────┐
│  4. Authorization Check          │
│     (Role-based access control)  │
└──────────────────────────────────┘
              ▼
┌──────────────────────────────────┐
│  5. Database Query Execution     │
│     (MongoDB operations)         │
└──────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────┐
│       Client Browser                │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐      ┌──────────────┐
│ CDN / Static  │      │ API Gateway  │
│ (Frontend)    │      │ (Backend)    │
└───────────────┘      └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌────────────────┐    ┌──────────────┐
            │ Load Balancer  │    │ Monitoring   │
            └────────┬───────┘    └──────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ Server  │  │ Server  │  │ Server  │
    │ Instance│  │ Instance│  │ Instance│
    └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │
         └────────────┼────────────┘
                      │
                      ▼
              ┌───────────────────┐
              │  Database Cluster │
              │  (MongoDB Atlas)  │
              └───────────────────┘
```

---

This architecture provides:
✅ Clean separation of concerns  
✅ Scalability  
✅ Security  
✅ Maintainability  
✅ Type safety  
