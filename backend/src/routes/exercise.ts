import { Router } from 'express';
import { getExerciseLibraryHandler } from '../controllers/exerciseController.js';
import { validate, exerciseQuerySchema } from '../middlewares/validation.js';

const router = Router();

router.get('/', validate(exerciseQuerySchema, 'query'), getExerciseLibraryHandler);

export default router;
