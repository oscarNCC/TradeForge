/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createAccount as createAccountModel,
  findAccountsByUserId,
  findAccountById,
  updateAccount as updateAccountModel,
  deleteAccount as deleteAccountModel,
  type AccountType,
} from '../models/Account';

const ACCOUNT_TYPES: AccountType[] = ['eval', 'demo_funded', 'live'];

export const createAccountValidation = [
  body('account_name').trim().notEmpty().isLength({ max: 100 }).withMessage('Account name required (max 100)'),
  body('account_type').optional().isIn(ACCOUNT_TYPES).withMessage('Invalid account type'),
  body('broker').optional().trim().isLength({ max: 100 }),
  body('initial_capital').optional().isFloat({ min: 0 }).withMessage('Initial capital must be a non-negative number'),
];

export async function createAccount(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { account_name, account_type, broker, initial_capital } = req.body as {
    account_name: string;
    account_type?: AccountType;
    broker?: string;
    initial_capital?: number;
  };
  const account = await createAccountModel(req.user.id, {
    account_name,
    account_type: account_type ?? null,
    broker: broker ?? null,
    initial_capital: initial_capital ?? null,
  });
  res.status(201).json({
    id: account.id,
    user_id: account.user_id,
    account_name: account.account_name,
    account_type: account.account_type,
    broker: account.broker,
    initial_capital: account.initial_capital,
    current_balance: account.current_balance,
    is_active: account.is_active,
    created_at: account.created_at,
    updated_at: account.updated_at,
  });
}

export async function getAccounts(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const accounts = await findAccountsByUserId(req.user.id);
  res.status(200).json(accounts);
}

export const getAccountByIdValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid account id')];

export async function getAccountById(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const id = Number(req.params.id);
  const account = await findAccountById(id, req.user.id);
  if (!account) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }
  res.status(200).json(account);
}

export const updateAccountValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid account id'),
  body('account_name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('account_type').optional().isIn(ACCOUNT_TYPES),
  body('broker').optional().trim().isLength({ max: 100 }),
  body('initial_capital').optional().isFloat({ min: 0 }),
  body('current_balance').optional().isFloat({ min: 0 }),
  body('is_active').optional().isBoolean(),
];

export async function updateAccount(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const id = Number(req.params.id);
  const data = req.body as {
    account_name?: string;
    account_type?: AccountType;
    broker?: string;
    initial_capital?: number;
    current_balance?: number;
    is_active?: boolean;
  };
  const account = await updateAccountModel(id, req.user.id, data);
  if (!account) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }
  res.status(200).json(account);
}

export const deleteAccountValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid account id')];

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const id = Number(req.params.id);
  const deleted = await deleteAccountModel(id, req.user.id);
  if (!deleted) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }
  res.status(200).json({ message: 'Account deleted' });
}
