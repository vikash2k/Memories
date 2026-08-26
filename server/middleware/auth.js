import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'memories_evernote_secret_key_2026';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) {
        req.userId = decoded.id;
        return next();
      }
    } catch (err) {
      // Non-JWT or local session token fallback
    }
  }

  req.userId = '1';
  next();
}
