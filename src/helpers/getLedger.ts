import {
  ERC721__factory,
  SealCredLedger,
} from '@big-whale-labs/seal-cred-ledger-contract'
import { QUERY_BLOCK_LIMIT } from '@big-whale-labs/constants'
import ledger from '@/helpers/ledger'
import provider from '@/helpers/provider'

export default async function getLedger(sealCredLedger: SealCredLedger) {
  const eventsFilter = await sealCredLedger.filters.SetMerkleRoot()
  const events = await sealCredLedger.queryFilter(
    eventsFilter,
    QUERY_BLOCK_LIMIT
  )

  for (const event of events) {
    ledger[event.args.tokenAddress] = {
      merkleRoot: event.args.merkleRoot,
      contract: ERC721__factory.connect(event.args.tokenAddress, provider),
    }
  }
}
