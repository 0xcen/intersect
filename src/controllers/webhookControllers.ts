import prisma from '../prisma';
import { Request, Response } from 'express';
import { Helius } from '../apis/helius';
import axios from 'axios';
import * as z from 'zod';

const subscriptionSchema = z.object({
  targetUrl: z.string().url().min(1),
  eventType: z.string().min(1),
  address: z.string().min(1),
});

type subscriptionSchema = z.infer<typeof subscriptionSchema>;

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { targetUrl, eventType, address } = subscriptionSchema.parse(
      req.body
    );

    // get or create webhook
    const wh = await Helius.getAllWebhooks();

    // todo: if wh [0] has more than 10k addresses, use a different webhook

    if (wh && wh[0]) {
      await Helius.updateWebhook({
        ...wh[0],
        accountAddresses:
          wh[0].accountAddresses?.lastIndexOf(address) === -1
            ? [...wh[0].accountAddresses, address]
            : [...wh[0].accountAddresses],
      });
    }
    //   2. save webhook to db with eventType
    await prisma.webhook.create({
      data: {
        targetUrl: targetUrl,
        userId: req.user!.id, // this route will never get here without a user
        eventType: eventType,
        address,
      },
    });

    return res.status(203).json({ status: 'ok' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.message });
    }
    res.json(error);
  }
};

export const postToWebhook = async (req: Request, res: Response) => {
  const [newTx] = req.body;

  const isJupV4 =
    newTx.accountData.filter(
      (ad: any) => ad.account === 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB'
    ).length > 0;

  if (isJupV4) return res.json({ status: 'ok' });

  try {
    //   1. get all items in db with address
    const allWebhooks = await prisma.webhook.findMany({
      where: { address: newTx.feePayer },
    });

    //  2. filter by eventType
    const filteredWebhooks = allWebhooks.filter(
      wh => wh.eventType === newTx.type || wh.eventType === 'ANY'
    );

    // 3. loop through and send to corresponding Zapier webhook
    filteredWebhooks.forEach(async wh => {
      await axios.post(wh.targetUrl, newTx);
    });

    // every item must have a unique id
    res.json({ ...newTx, id: newTx.signature });
  } catch (error) {
    res.status(500).json(error);
  }
};
