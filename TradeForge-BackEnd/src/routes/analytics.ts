import { Router } from 'express';
import * as AnalyticsController from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication
router.use(authMiddleware);

router.get('/summary', AnalyticsController.getSummary);
router.get('/daily', AnalyticsController.getDailyStats);
router.get('/monthly', AnalyticsController.getMonthlyStats);
router.get('/by-setup', AnalyticsController.getBySetup);
router.get('/by-session', AnalyticsController.getByTimeSession);
router.get('/equity-curve', AnalyticsController.getEquityCurve);

export default router;
