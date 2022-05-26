import { SealCredLedger } from '@big-whale-labs/seal-cred-ledger-contract'
import getAllEvents from '@/helpers/getAllEvents'
import getLedgerRecord from '@/helpers/getLedgerRecord'
import ledger from '@/helpers/ledger'

export default async function getLedger(sealCredLedger: SealCredLedger) {
  const { events, deleteTopic } = await getAllEvents(sealCredLedger)
  const addressToMerkle: { [address: string]: string } = {}

  for (const event of events) {
    const {
      args: { tokenAddress, merkleRoot },
      topic,
    } = event
    if (deleteTopic === topic) {
      delete addressToMerkle[tokenAddress]
      continue
    }

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
