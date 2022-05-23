import { QUERY_BLOCK_LIMIT } from '@big-whale-labs/constants'
import { SealCredLedger } from '@big-whale-labs/seal-cred-ledger-contract'
import getLedgerRecord from '@/helpers/getLedgerRecord'
import ledger from '@/helpers/ledger'

export default async function getLedger(sealCredLedger: SealCredLedger) {
  const eventsFilter = sealCredLedger.filters.SetMerkleRoot()
  const events = await sealCredLedger.queryFilter(
    eventsFilter,
    QUERY_BLOCK_LIMIT
  )
  const addressToMerkle: { [address: string]: string } = {}

  for (const event of events) {
    const { tokenAddress, merkleRoot } = event.args
    addressToMerkle[tokenAddress] = merkleRoot
  }

  for (const tokenAddress in addressToMerkle) {
    ledger[tokenAddress] = await getLedgerRecord(
      sealCredLedger,
      tokenAddress,
      addressToMerkle[tokenAddress]
    )
  }
}
