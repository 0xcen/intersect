import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/webhooks

// to Helius
router.route('/:address').post((req: Request, res: Response) => {
  // params have apiKey, address, userId, and eventType
  res.send(req.params.address);
});

// to Zapier
router.route('/:userId').post((req: Request, res: Response) => {
  // every item must have a unique id
  res.send(req.params.userId);
});

export default router;
