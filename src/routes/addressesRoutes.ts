import axios from 'axios';
import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/addresses
router
  .route('/:address/transactions')
  .get(async (req: Request, res: Response) => {
    const { address } = req.params;
    const { eventType } = req.query;
    const { data: testRes } = await axios.get(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`,
      { params: { type: eventType ?? 'ANY' } }
    );

    res.json(testRes.map((tx: any) => ({ ...tx, id: tx.signature })));
  });

router.route('/:address/balance').get((req: Request, res: Response) => {});
router.route('/:address/nfts').get((req: Request, res: Response) => {});
router.route('/:address/nft-events').get((req: Request, res: Response) => {});
// router.route('/:address/names').get((req: Request, res: Response) => {});

export default router;
