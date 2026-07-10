import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getCoinBalanceHandler,
  getCoinHistoryHandler,
  getTitlesHandler,
  equipTitleHandler,
} from '../controllers/economyController.js';

const router = Router();

router.get('/coins', requireAuth, getCoinBalanceHandler);
router.get('/coins/history', requireAuth, getCoinHistoryHandler);
router.get('/titles', requireAuth, getTitlesHandler);
router.post('/titles/:id/equip', requireAuth, equipTitleHandler);

export default router;
