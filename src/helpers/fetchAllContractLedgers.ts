import { QUERY_BLOCK_LIMIT } from '@big-whale-labs/constants'
import allContracts from '@/helpers/allContracts'
import ledger from '@/helpers/ledger'

export default async function () {
  for (const { contract } of Object.values(ledger)) {
    const eventsFilter = await contract.filters.Transfer()
    const events = await contract.queryFilter(eventsFilter, QUERY_BLOCK_LIMIT)
    for (const event of events) {
      if (!event.args) {
        continue
      }
      const { to, tokenId } = event.args
      if (to) {
        if (!allContracts[contract.address]) allContracts[contract.address] = {}
        allContracts[contract.address][tokenId.toNumber()] = to
      }
    }
  }
}
