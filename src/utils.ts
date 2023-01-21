import { PublicKey } from '@solana/web3.js';
import { randomBytes } from 'crypto';

export const generateApiKey = () => {
  const buffer = randomBytes(32);
  return buffer.toString('base64');
};

export const validatePubKey = (pubKey: string) => {
  const isValidPubKey = PublicKey.isOnCurve(new PublicKey(pubKey).toBytes());

  if (!isValidPubKey) throw new Error('Invalid public key');

  return pubKey;
};
