import axios from 'axios';
import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/addresses
router
  .route('/:address/transactions')
  .get(async (req: Request, res: Response) => {
    const { address } = req.params;
    const { eventType } = req.query;
    try {
      const { data: testRes } = await axios.get(
        `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`,
        { params: { type: eventType ?? 'ANY' } }
      );

      res.json(testRes.map((tx: any) => ({ ...tx, id: tx.signature })));
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          '🚀 ~ file: addressesRoutes.ts:20 ~ .get ~ error',
          error.message
        );
        res.status(400).json({ status: 'error', message: error.message });
      }
    }
  });

router.route('/:address/balance').get((req: Request, res: Response) => {});
router.route('/:address/nfts').get((req: Request, res: Response) => {});
router.route('/:address/nft-events').get((req: Request, res: Response) => {});
// router.route('/:address/names').get((req: Request, res: Response) => {});

export default router;
