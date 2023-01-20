import { Router, Request, Response } from 'express';
import { protect } from '../controllers/authControllers';
import { postToWebhook, subscribe } from '../controllers/webhookControllers';

const router = Router();

// /api/v1/webhooks

// to Zapier
router.route('/').post(postToWebhook);

// to Helius
router.route('/subscribe').post(protect, subscribe);
// router.route('/unsubscribe').post(protect, unsubscribe);

export default router;
