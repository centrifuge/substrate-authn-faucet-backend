import { Router } from 'express';
import * as userController from '../controllers/user';

const router = new Router();

// TODO: Remove this before going live.
router.get('/', userController.getAll);

export default router;
