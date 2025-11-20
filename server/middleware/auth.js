import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided for route:', req.originalUrl);
      return res.status(401).json({ error: 'Not authorized to access this route - No token provided' });
    }

    console.log('Attempting to verify token with JWT_SECRET:', JWT_SECRET ? '(set)' : '(not set)');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('User authenticated:', decoded.id, 'Role:', decoded.role, 'for route:', req.originalUrl);
    next();
  } catch (error) {
    console.log('Token verification failed for route:', req.originalUrl, 'Error:', error.message);
    return res.status(401).json({ error: 'Not authorized to access this route - Invalid token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'User role is not authorized to access this route' });
    }
    next();
  };
};

// Admin middleware - shorthand for authorize('admin')
export const admin = (req, res, next) => {
  console.log('Admin check - User:', req.user, 'for route:', req.originalUrl);
  
  if (!req.user) {
    console.log('Admin check failed: No user object found');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    console.log('Admin access denied for user:', req.user?.id, 'Role:', req.user?.role);
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  console.log('Admin access granted for:', req.user.id);
  next();
};

// Alternative exports for compatibility
export const authenticateToken = protect;
export const isAdmin = admin;
export const adminOnly = admin; // Additional alias
