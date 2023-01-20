import { Router, Request, Response } from 'express';
import { generateApiKey } from '../utils';
import prisma from '../prisma';

const router = Router();

// /api/v1/users
router.route('/:pubkey/new').get(async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      pubKey: req.params.pubkey,
      apiKey: generateApiKey(),
    },
  });

  res.json(user);
});

export default router;
