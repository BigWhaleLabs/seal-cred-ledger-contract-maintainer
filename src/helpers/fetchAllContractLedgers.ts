import allContracts from '@/helpers/allContracts'
import ledger from '@/helpers/ledger'
import queryBlockLimit from '@/helpers/queryBlockLimit'

export default async function () {
  for (const { contract } of Object.values(ledger)) {
    const eventsFilter = await contract.filters.Transfer()
    const events = await contract.queryFilter(eventsFilter, queryBlockLimit)
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
