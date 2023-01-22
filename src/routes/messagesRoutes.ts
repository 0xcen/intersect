import { CreateThreadCommand, ThreadMemberScope } from '@dialectlabs/sdk';
import { Router, Request, Response } from 'express';
import dialect from '../apis/dialect';
import { validatePubKey } from '../utils';

const router = Router();

// /api/v1/dialect
router.route('/:address/new').post(async (req: Request, res: Response) => {
  const { address } = req.params;
  const { msg } = req.body;

  try {
    if (!address) return res.json({ error: 'No address provided' });
    if (!msg) return res.json({ error: 'No message provided' });

    // Todo: resolve address to username

    validatePubKey(address);

    let thread = await dialect.threads.find({ otherMembers: [address] });

    if (!thread) {
      const command: CreateThreadCommand = {
        encrypted: false,
        me: {
          scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
        },
        otherMembers: [
          {
            address: address,
            scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
          },
        ],
      };

      thread = await dialect.threads.create(command);
    }

    const msgRes = await thread.send({ text: msg });

    res.json({ status: 'success', message: msgRes });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
});

export default router;
