import {
  ERC721__factory,
  StreetCredLedger,
} from '@big-whale-labs/street-cred-ledger-contract'
import ledger from '@/helpers/Ledger'
import provider from '@/helpers/provider'

export default async function getLedger(streetCredLedger: StreetCredLedger) {
  const eventsFilter = await streetCredLedger.filters.SetMerkleRoot()
  const events = await streetCredLedger.queryFilter(eventsFilter)

  for (const event of events) {
    ledger[event.args.tokenAddress] = {
      merkleRoot: event.args.merkleRoot,
      contract: ERC721__factory.connect(event.args.tokenAddress, provider),
    }
  }
}
