import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';
import { findUserById } from '../models/User';

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
