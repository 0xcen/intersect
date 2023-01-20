import { Router, Request, Response } from 'express';
import { generateApiKey } from '../utils';
import prisma from '../prisma';
import { PublicKey } from '@solana/web3.js';

const router = Router();

// /api/v1/users
router.route('/:pubkey/new').get(async (req: Request, res: Response) => {
  try {
    const isValidPubKey = PublicKey.isOnCurve(
      new PublicKey(req.params.pubkey).toBytes()
    );

    if (!isValidPubKey) throw new Error('Invalid public key');

    const user = await prisma.user.create({
      data: {
        pubKey: req.params.pubkey,
        apiKey: generateApiKey(),
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
    res.status(400).json({ status: 'error', message: error });
  }
});

export default router;
