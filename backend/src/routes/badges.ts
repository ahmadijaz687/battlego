import { Router } from 'express';
import { getBadgesHandler } from '../controllers/gamificationController.js';

const router = Router();

router.get('/', getBadgesHandler);

export default router;
