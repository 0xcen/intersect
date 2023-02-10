import { EnrichedTransaction } from 'helius-sdk';

export const handleTokenMint = (
  txData: EnrichedTransaction,
  mintAddress: string
) => {
  const mostRelevantTx = txData.tokenTransfers?.find(
    t => t.mint === mintAddress
  );

  if (mostRelevantTx) {
    return { ...txData, mostRelevantTransfer: mostRelevantTx };
  }

  return txData;
};
