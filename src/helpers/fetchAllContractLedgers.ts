import { QUERY_BLOCK_LIMIT } from '@big-whale-labs/constants'
import allContracts from '@/helpers/allContracts'
import ledger from '@/helpers/ledger'

export default async function () {
  for (const { originalContract } of Object.values(ledger)) {
    const eventsFilter = await originalContract.filters.Transfer()
    const events = await originalContract.queryFilter(
      eventsFilter,
      QUERY_BLOCK_LIMIT
    )
    for (const event of events) {
      if (!event.args) {
        continue
      }
      const { to, tokenId } = event.args
      if (to) {
        if (!allContracts[originalContract.address])
          allContracts[originalContract.address] = {}
        allContracts[originalContract.address][tokenId.toNumber()] = to
      }
    }
  }
}
