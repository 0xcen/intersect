import { Router, Request, Response } from 'express';
import { Helius } from 'src/apis/helius';
import prisma from 'src/prisma';

const router = Router();

// /api/v1/webhooks

// to Helius
router.route('/:address').post(async (req: Request, res: Response) => {
  const { address } = req.params;
  const { userId, eventType, url } = req.query;

  if (!userId || !eventType || !url)
    return new Error('Missing required query params');

  //   1. create webhook
  const wh = await Helius.getAllWebhooks();
  if (wh) {
    Helius.updateWebhook({
      ...wh[0],
      accountAddresses:
        wh[0].accountAddresses.lastIndexOf(address) === -1
          ? [...wh[0].accountAddresses, address]
          : wh[0].accountAddresses,
    });
  }

  //   2. save webhook to db with eventType
  const dbRes = await prisma.webhook.create({
    data: {
      url: url as string,
      userId: userId as string,
      eventType: eventType as string,
      address,
    },
  });
  console.log('🚀 ~ file: webhooksRoutes.ts:38 ~ router.route ~ dbRes', dbRes);

  res.status(203).send({ status: 'ok' });
});

// to Zapier
router.route('/:userId').post((req: Request, res: Response) => {
  //   1. get all items in db with address
  //  2. filter by eventType
  // 3. loop through and send to corresponding Zapier webhook
  // every item must have a unique id
  res.send(req.params.userId);
});

export default router;
