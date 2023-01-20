import { Router, Request, Response } from 'express';
import { Helius } from '../apis/helius';
import prisma from '../prisma';

const router = Router();

// /api/v1/webhooks

// to Zapier
router.route('/new').post((req: Request, res: Response) => {
  //   1. get all items in db with address
  //  2. filter by eventType
  // 3. loop through and send to corresponding Zapier webhook
  // every item must have a unique id
  // todo: fix webhook url before testing
  console.log('/new', req.body);

  res.json(req.body);
});

// to Helius
router.route('/:address').post(async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { apiKey } = req.query;
    const { targetUrl, eventType } = req.body;

    console.log(JSON.stringify({ ...req.body, apiKey, address }));

    if (!eventType || !targetUrl)
      return res.status(400).json({ status: 'error' });

    //   1. create webhook

    const wh = await Helius.getAllWebhooks();
    if (wh && wh[0]) {
      console.log('🚀 ~ file: webhooksRoutes.ts:35 ~ router.route ~ wh', wh);
      await Helius.updateWebhook({
        ...wh[0],
        accountAddresses:
          wh[0].accountAddresses?.lastIndexOf(address) === -1
            ? [...wh[0].accountAddresses, address]
            : [...wh[0].accountAddresses],
      });
    }

    const user = await prisma.user.upsert({
      where: { apiKey: apiKey as string },
      update: {},
      create: {
        pubKey: '9apnHjEQ8enLaPLxP7z9VQTphWE4nWqZcyHJYocQMpSE',
        apiKey: apiKey as string,
      },
    });

    //   2. save webhook to db with eventType
    await prisma.webhook.create({
      data: {
        targetUrl: targetUrl as string,
        userId: user.id as string,
        eventType: eventType as string,
        address,
      },
    });
    return res.status(203).json({ status: 'ok' });
  } catch (error) {
    console.log(
      '🚀 ~ file: webhooksRoutes.ts:54 ~ router.route ~ error',
      error
    );

    res.json(error);
  }
});

export default router;
