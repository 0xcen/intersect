import { randomBytes } from 'crypto';

export const generateApiKey = () => {
  const buffer = randomBytes(32);
  return buffer.toString('base64');
};
