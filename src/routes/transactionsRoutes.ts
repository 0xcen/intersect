import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/transactions
router.route('/').post((req: Request, res: Response) => {
  res.json(req.params.address);
});

router.route('/raw').post((req: Request, res: Response) => {
  res.json(req.params.address);
});

export default router;
