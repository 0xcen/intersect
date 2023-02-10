import axios from 'axios';
import { Router, Request, Response } from 'express';
import { EnrichedTransaction, TransactionType } from 'helius-sdk';
import { protect } from '../controllers/authControllers';
import {
  postToWebhook,
  subscribe,
  updateUrl,
} from '../controllers/webhookControllers';
import { handleTokenMint } from '../utils/parsers';

const router = Router();

// /api/v1/webhooks

// to Zapier
router.route('/').post(postToWebhook);

// to Helius
router.route('/subscribe').post(protect, subscribe);
// router.route('/unsubscribe').post(protect, unsubscribe);

router.route('/updateUrl').post(updateUrl);

router.route('/:address/test').get(async (req: Request, res: Response) => {
  const { address } = req.params;

  const { eventType } = req.query;

  try {
    const { data: testRes } = await axios.get<EnrichedTransaction[]>(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`,
      { params: { type: eventType ?? 'ANY' } }
    );

    if (testRes.length === 0) {
      const { data: anyRes } = await axios.get(
        `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`,
        { params: { type: 'ANY' } }
      );

      return res.json(anyRes.map((tx: any) => ({ ...tx, id: tx.signature })));
    }

    res.json(
      testRes.map(tx => {
        if (tx.type === TransactionType.TOKEN_MINT) {
          return { ...handleTokenMint(tx, address), id: tx.signature };
        }
        return { ...tx, id: tx.signature };
      })
    );
  } catch (error) {
    // if axios error
    if (axios.isAxiosError(error)) {
      console.log(
        '🚀 ~ file: webhooksRoutes.ts:43 ~ router.route ~ error',
        error.message
      );
      return res.status(error.response!.status).json(error.response!.data);
    }
  }
});

export default router;
