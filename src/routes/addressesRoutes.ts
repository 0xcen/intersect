import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/addresses
router.route('/:address/transactions').get((req: Request, res: Response) => {
  res.json(req.params.address);
});

router.route('/:address/balance').get((req: Request, res: Response) => {});
router.route('/:address/nfts').get((req: Request, res: Response) => {});
router.route('/:address/nft-events').get((req: Request, res: Response) => {});
// router.route('/:address/names').get((req: Request, res: Response) => {});

export default router;
