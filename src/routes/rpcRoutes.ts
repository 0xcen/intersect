import { Connection, PublicKey } from '@solana/web3.js';
import { Router, Request, Response } from 'express';

const router = Router();

// /api/v1/rpc
router.route('/').post((req: Request, res: Response) => {
  res.json(req.params.address);
});

router.route('/mint/:address').get(async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const connection = new Connection(
      `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`
    );

    const accInfo = await connection.getParsedAccountInfo(
      new PublicKey(address)
    );
    res.json(accInfo);
  } catch (error) {
    console.log('🚀 ~ file: rpcRoutes.ts:23 ~ router.route ~ error', error);
  }
});

export default router;
