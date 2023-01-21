import axios from 'axios';
import { Router, Request, Response } from 'express';
import { protect } from '../controllers/authControllers';
import {
  postToWebhook,
  subscribe,
  updateUrl,
} from '../controllers/webhookControllers';

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
  console.log(
    '🚀 ~ file: webhooksRoutes.ts:25 ~ router.route ~ address',
    address
  );
  const { eventType } = req.query;
  console.log(
    '🚀 ~ file: webhooksRoutes.ts:27 ~ router.route ~ eventType',
    eventType
  );
  try {
    const { data: testRes } = await axios.get(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`,
      { params: { type: eventType ?? 'ANY' } }
    );
    console.log(
      '🚀 ~ file: webhooksRoutes.ts:39 ~ router.route ~ testRes',
      testRes
    );

    if (testRes.length === 0) {
      const { data: anyRes } = await axios.get(
        `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`,
        { params: { type: 'ANY' } }
      );
      console.log(
        '🚀 ~ file: webhooksRoutes.ts:46 ~ router.route ~ anyRes',
        anyRes
      );

      return res.json(anyRes.map((tx: any) => ({ ...tx, id: tx.signature })));
    }

    res.json(testRes.map((tx: any) => ({ ...tx, id: tx.signature })));
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
