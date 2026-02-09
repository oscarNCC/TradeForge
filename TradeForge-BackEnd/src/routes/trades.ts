import { Router } from 'express';
import * as TradeController from '../controllers/tradeController';
import { authMiddleware } from '../middleware/auth';
import * as TradeValidation from '../middleware/tradeValidation';
import { importCSV } from '../controllers/importController';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All trade routes require authentication
router.use(authMiddleware);

router.post(
    '/import',
    upload.single('file'),
    importCSV
);

router.post(
    '/',
    TradeValidation.validateCreateTrade,
    TradeController.createTrade
);

router.get(
    '/',
    TradeValidation.validateGetTrades,
    TradeController.getTrades
);

router.get(
    '/:id',
    TradeController.getTradeById
);

router.put(
    '/:id',
    TradeValidation.validateUpdateTrade,
    TradeController.updateTrade
);

router.patch(
    '/:id/close',
    TradeValidation.validateCloseTrade,
    TradeController.closeTrade
);

router.delete(
    '/:id',
    TradeController.deleteTrade
);

export default router;
