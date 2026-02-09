/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { findUserByEmail, createUser } from '../models/User';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/tokenUtils';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').optional().trim().isLength({ max: 100 }),
];

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password, username } = req.body as { email: string; password: string; username?: string };
  const existing = await findUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: 'Email already registered' });
    return;
  }
  const password_hash = await hashPassword(password);
  const id = await createUser({ email, password_hash, username: username || null });
  const user = { id, email, username: username || null };
  const token = generateToken(id, email);
  res.status(201).json({ token, user });
}

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password } = req.body as { email: string; password: string };
  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const token = generateToken(user.id, user.email);
  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, username: user.username },
  });
}

export function getCurrentUser(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.status(200).json(req.user);
}
