import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { uploadSingle } from '../middlewares/upload.js';
import {
  uploadImageHandler,
  uploadAvatarHandler,
  uploadVideoHandler,
} from '../controllers/uploadController.js';

const router = Router();

router.post('/image', requireAuth, uploadSingle, uploadImageHandler);
router.post('/avatar', requireAuth, uploadSingle, uploadAvatarHandler);
router.post('/video', requireAuth, uploadSingle, uploadVideoHandler);

export default router;
