import prisma from '../prisma';
import { Request, Response } from 'express';
import { Helius } from '../apis/helius';
import axios from 'axios';
import * as z from 'zod';
import { handleTokenMint } from '../utils/parsers';
import { TransactionType } from 'helius-sdk';

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
  let [payload] = req.body;
  let filter = [
    payload.description.split(' ')[0],
    payload.description.split(' ').pop().replace('.', ''),
    payload.feePayer,
    ...Object.values(
      payload.tokenTransfers[payload.tokenTransfers.length - 1]
    ).map(v => String(v)),
  ];

  // 1) check fee payer,
  // 2) check last tokenTransfer's keys

  console.log('Recieved new Tx:', payload.type);

  // escape any or unknow for now
  if (
    payload.type === 'ANY' ||
    payload.type === 'UNKNOWN' ||
    !payload.description
  )
    return res.json({ status: 'ok' });

  if (payload.type.includes('NFT') && payload?.events?.nft?.nfts[0]?.mint) {
    filter = [payload.events.nft.nfts[0].mint];
  }

  const isJupV4 =
    payload.accountData.filter(
      (ad: any) => ad.account === 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB'
    ).length > 0;

  if (isJupV4) return res.json({ status: 'ok' });

  try {
    const allWebhooks = await prisma.webhook.findMany({
      where: { address: { in: filter } },
    });

    const filteredWebhooks = allWebhooks.filter(
      wh => wh.eventType === payload.type || wh.eventType === 'ANY'
    );
    for (let wh of filteredWebhooks) {
      console.log('📬 Posting to: ', wh);
      switch (payload.type) {
        case TransactionType.TOKEN_MINT:
          payload = handleTokenMint(payload, wh.address);
          break;
        default:
          payload = req.body[0];
          break;
      }

      await axios.post(wh.targetUrl, { ...payload, id: payload.signature });
    }
    // every item must have a unique id
    res.json();
  } catch (error) {
    console.log('🚩 Failed to post to webhook: ', error);
    res.status(500).json(error);
  }
};

export const updateUrl = async (req: Request, res: Response) => {
  const webhooks = await Helius.getAllWebhooks();

  if (!webhooks) return res.status(404).json({ error: 'No webhook found' });
  if (!req.body.webhookURL)
    return res.status(404).json({ error: 'Bad request' });

  const updatedWebhook = await Helius.updateWebhook({
    ...webhooks[0],
    webhookURL: req.body.webhookURL,
  });

  res.json(updatedWebhook);
};
