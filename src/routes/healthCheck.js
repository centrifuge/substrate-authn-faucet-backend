import { Router } from 'express';
import * as tokenRequestController from '../controllers/tokenRequest';

const router = new Router();

router.get('/', tokenRequestController.healthCheck);

export default router;
