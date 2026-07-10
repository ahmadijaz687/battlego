import { Router } from 'express';
import { listNotificationsHandler, markNotificationReadHandler } from '../controllers/notificationController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate, notificationReadSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/', requireAuth, listNotificationsHandler);
router.post('/read', requireAuth, validate(notificationReadSchema), markNotificationReadHandler);

export default router;
