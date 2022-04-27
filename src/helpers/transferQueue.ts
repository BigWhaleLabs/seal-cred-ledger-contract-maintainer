import { TransferEvent } from '@big-whale-labs/street-cred-ledger-contract/dist/typechain/contracts/SCERC721Derivative'
import checkContractRoot from '@/helpers/checkContractRoot'
import ledger from '@/helpers/Ledger'

const transferQueue = [] as TransferEvent[]

async function check() {
  console.log('Checking events...')
  const events = transferQueue.splice(0, transferQueue.length)
  if (!events.length) {
    console.log('No events to check')
    return
  }
  for (const event of events) {
    const currentMerkleRoot = ledger[event.address].merkleRoot
    await checkContractRoot(event.address, currentMerkleRoot)
  }
}

export function startCheckingTransferEvents() {
  setInterval(check, 10 * 1000)
}

export function addTransferEvent(event: TransferEvent) {
  transferQueue.push(event)
}
