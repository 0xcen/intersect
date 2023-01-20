import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/rpc
router.route('/').post((req: Request, res: Response) => {
  res.json(req.params.address);
});

export default router;
