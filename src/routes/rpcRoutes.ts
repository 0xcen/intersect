import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/rpc
router.route('/').post((req: Request, res: Response) => {
  res.send(req.params.address);
});

export default router;
