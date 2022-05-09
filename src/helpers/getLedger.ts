import {
  ERC721__factory,
  SealCredLedger,
} from '@big-whale-labs/seal-cred-ledger-contract'
import ledger from '@/helpers/Ledger'
import provider from '@/helpers/provider'

export default async function getLedger(sealCredLedger: SealCredLedger) {
  const eventsFilter = await sealCredLedger.filters.SetMerkleRoot()
  const events = await sealCredLedger.queryFilter(eventsFilter)

  for (const event of events) {
    ledger[event.args.tokenAddress] = {
      merkleRoot: event.args.merkleRoot,
      contract: ERC721__factory.connect(event.args.tokenAddress, provider),
    }
  }
}
