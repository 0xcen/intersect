require('dotenv').config();
// Common imports
import {
  Dialect,
  DialectCloudEnvironment,
  DialectSdk,
  IdentityResolver,
} from '@dialectlabs/sdk';

// Solana-specific imports
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
    // IMPORTANT: must set environment variable DIALECT_SDK_CREDENTIALS
    // to your dapp's Solana messaging wallet keypair e.g. [170,23, . . . ,300]

    wallet: NodeDialectSolanaWalletAdapter.create(keypair),
  })
);

sdk.identity;

// // map stage user details from mongo to Dialect identity
// // will need to update this when we move over to Spling as well
// export class StageIdentityResolver {
//   async resolve(address) {
//     try {
//       return await api
//         .get({
//           endpoint: users/wallet/${address},
//         })
//         .then(async (response) => {
//           // user exists
//           if (response?.data?.wallet && response?.data?.id) {
//             const pfpUrl = await getImage(response?.data?.pfp);
//             return {
//               name: response?.data?.name,
//               type: "STAGE_SOCIAL",
//               address: response?.data?.wallet,
//               additionals: {
//                 avatarUrl: pfpUrl,
//                 displayName: response?.data?.handle,
//               },
//             };
//           }
//         });
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // reverse resolver, used to map a handle search in the input field to user's pub key
//   async resolveReverse(domainName) {
//     try {
//       return await api
//         .get({
//           endpoint: users/getPK/${domainName},
//         })
//         .then(async (response) => {
//           // success
//           if (response?.data?.user?.wallet) {
//             return { address: response?.data?.user?.wallet };
//           }
//         });
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   type() {
//     return "STAGE_SOCIAL";
//   }
// }

export default sdk;
