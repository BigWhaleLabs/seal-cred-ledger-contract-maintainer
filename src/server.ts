import 'module-alias/register'
import 'source-map-support/register'

import {
  addAddressToUpdateQueue,
  startCheckingUpdateQueue,
} from '@/helpers/updateQueue'
import fetchAllContractLedgers from '@/helpers/fetchAllContractLedgers'
import getLedger from '@/helpers/getLedger'
import ledger from '@/helpers/ledger'
import sealCredLedger from '@/helpers/sealCredLedger'
import setupERC721Listener from '@/helpers/setupERC721Listener'
import setupSealCredLedgerListeners from '@/helpers/setupSealCredLedgerListeners'

void (async () => {
  console.log('Starting the app...')
  console.log('Getting the ledger...')
  await getLedger(sealCredLedger)
  console.log(`Got the ledger with ${Object.keys(ledger).length} entries`)
  console.log('Populating the contracts...')
  await fetchAllContractLedgers()
  console.log(
    'Setting up SetMerkleRoot and DeleteMerkleRoot listeners on SealCredLedger...'
  )
  setupSealCredLedgerListeners()
  console.log('Setting up listeners for token contracts...')
  for (const { originalContract } of Object.values(ledger)) {
    setupERC721Listener(originalContract)
  }
  console.log('Adding all contracts for recheck...')
  for (const contract of Object.keys(ledger)) {
    await addAddressToUpdateQueue(contract)
  }
  console.log('Start checking the update queue...')
  startCheckingUpdateQueue()
  console.log('The app started!')
})()
