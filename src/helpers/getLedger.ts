import { SealCredLedger } from '@big-whale-labs/seal-cred-ledger-contract'
import { getAddressesToMerkleRoot } from '@big-whale-labs/frontend-utils'
import getLedgerRecord from '@/helpers/getLedgerRecord'
import ledger from '@/helpers/ledger'

export default async function getLedger(sealCredLedger: SealCredLedger) {
  const addressToMerkleRoot = await getAddressesToMerkleRoot(sealCredLedger)

  console.log(addressToMerkleRoot)

  for (const tokenAddress in addressToMerkleRoot) {
    ledger[tokenAddress] = await getLedgerRecord(
      sealCredLedger,
      tokenAddress,
      addressToMerkleRoot[tokenAddress]
    )
  }
}
