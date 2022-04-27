import 'module-alias/register'
import 'source-map-support/register'

import { Contract } from 'ethers'
import { ERC721__factory } from '@big-whale-labs/street-cred-ledger-contract'
import {
  addTransferEvent,
  startCheckingTransferEvents,
} from '@/helpers/transferQueue'
import checkContractRoot from '@/helpers/checkContractRoot'
import erc721abi from '@/helpers/erc721abi'
import getLedger from '@/helpers/getLedger'
import ledger from '@/helpers/Ledger'
import provider from '@/helpers/provider'
import streetCredLedger from '@/helpers/streetCredLedger'

void (async () => {
  console.log('Starting the app...')

  console.log('Getting the ledger...')
  await getLedger(streetCredLedger)

  console.log(`Got the ledger with ${Object.keys(ledger).length} entries`)

  console.log('Setting up sc listeners...')
  streetCredLedger.on(
    streetCredLedger.filters.SetMerkleRoot(),
    (tokenAddress, merkleRoot) => {
      if (!ledger[tokenAddress]) {
        const contract = ERC721__factory.connect(tokenAddress, provider)
        ledger[tokenAddress] = {
          merkleRoot,
          contract,
        }
        contract.on(contract.filters.Transfer(), async () => {
          console.log(
            `Transfer event on ${tokenAddress}, adding to transferQueue`
          )
          const eventsFilter = contract.filters.Transfer()
          const events = await contract.queryFilter(eventsFilter)
          const event = events[events.length - 1]
          addTransferEvent(event)
        })
      } else {
        ledger[tokenAddress].merkleRoot = merkleRoot
      }
    }
  )
  streetCredLedger.on(
    streetCredLedger.filters.DeleteMerkleRoot(),
    (tokenAddress) => {
      ledger[tokenAddress].contract.removeAllListeners()
      delete ledger[tokenAddress]
    }
  )

  console.log('Done setting up sc listeners')

  console.log('Setting up listeners for token contracts...')

  const tokenContracts = Object.keys(ledger)

  for (const tokenAddress of tokenContracts) {
    const contract = ledger[tokenAddress].contract
    contract.on(contract.filters.Transfer(), async () => {
      console.log(`Transfer event on ${tokenAddress}, adding to transferQueue`)

      const eventsFilter = contract.filters.Transfer()
      const events = await contract.queryFilter(eventsFilter)
      const event = events[events.length - 1]
      addTransferEvent(event)
    })
  }

  console.log('Start checking the transfer queue...')
  startCheckingTransferEvents()
})()
