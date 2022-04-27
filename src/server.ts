import 'module-alias/register'
import 'source-map-support/register'

import { startCheckingUpdateQueue } from '@/helpers/updateQueue'
import getLedger from '@/helpers/getLedger'
import ledger from '@/helpers/Ledger'
import setupERC721Listener from '@/helpers/setupERC721Listener'
import setupStreetCredLedgerListeners from '@/helpers/setupStreetCredLedgerListeners'
import streetCredLedger from '@/helpers/streetCredLedger'

void (async () => {
  console.log('Starting the app...')
  console.log('Getting the ledger...')
  await getLedger(streetCredLedger)
  console.log(`Got the ledger with ${Object.keys(ledger).length} entries`)
  console.log(
    'Setting up SetMerkleRoot and DeleteMerkleRoot listeners on StreetCredLedger...'
  )
  setupStreetCredLedgerListeners()
  console.log('Setting up listeners for token contracts...')
  for (const { contract } of Object.values(ledger)) {
    setupERC721Listener(contract)
  }
  console.log('Start checking the update queue...')
  startCheckingUpdateQueue()
  console.log('The app started!')
})()
