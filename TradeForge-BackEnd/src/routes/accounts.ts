import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createAccount,
  createAccountValidation,
  getAccounts,
  getAccountById,
  getAccountByIdValidation,
  updateAccount,
  updateAccountValidation,
  deleteAccount,
  deleteAccountValidation,
} from '../controllers/accountController';

const router = Router();

router.use(authMiddleware);

router.post('/', createAccountValidation, createAccount);
router.get('/', getAccounts);
router.get('/:id', getAccountByIdValidation, getAccountById);
router.put('/:id', updateAccountValidation, updateAccount);
router.delete('/:id', deleteAccountValidation, deleteAccount);

export default router;
