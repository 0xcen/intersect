require('dotenv').config();
import { Dialect, DialectCloudEnvironment, DialectSdk } from '@dialectlabs/sdk';

import {
  Solana,
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter,
} from '@dialectlabs/blockchain-sdk-solana';
import { Keypair } from '@solana/web3.js';

const environment: DialectCloudEnvironment = 'production';

const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.DIALECT_SDK_CREDENTIALS!))
);

const sdk: DialectSdk<Solana> = Dialect.sdk(
  {
    environment,
  },
  SolanaSdkFactory.create({
    wallet: NodeDialectSolanaWalletAdapter.create(keypair),
  })
);

export default sdk;
