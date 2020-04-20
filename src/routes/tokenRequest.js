import { Router } from 'express';
import * as tokenRequestController from '../controllers/tokenRequest';

const router = new Router();

router.post('/', tokenRequestController.requestTokens);

export default router;
