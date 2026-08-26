import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'memories_evernote_secret_key_2026';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      return next();
    } catch (err) {
      // Invalid token fallback to default user
    }
  }

  // Default demo user id if no token provided
  req.userId = '1';
  next();
}
