import 'module-alias/register'
import 'source-map-support/register'

import { Contract } from 'ethers'
import Ledger from '@/types/Ledger'
import checkContractRoot from '@/helpers/checkContractRoot'
import erc721abi from '@/helpers/erc721abi'
import getLedger from '@/helpers/getLedger'
import provider from '@/helpers/provider'
import streetCredLedger from '@/helpers/streetCredLedger'

let ledger: Ledger

void (async function main() {
  console.log('Starting the app...')

  console.log('Getting the ledger...')
  ledger = await getLedger(streetCredLedger)

  console.log(`Got the ledger with ${Object.keys(ledger).length} entries`)

  console.log('Setting up sc listeners...')
  streetCredLedger.on(
    streetCredLedger.filters.SetMerkleRoot(),
    (tokenAddress, merkleRoot) => {
      ledger[tokenAddress].merkleRoot = merkleRoot
    }
  )
  streetCredLedger.on(
    streetCredLedger.filters.DeleteMerkleRoot(),
    (tokenAddress) => {
      delete ledger[tokenAddress]
    }
  )
  console.log('Done setting up sc listeners')

  console.log('Checking the merkle roots...')
  for (const [tokenAddress, tokenContents] of Object.entries(ledger)) {
    await checkContractRoot(tokenAddress, tokenContents.merkleRoot)
  }
  console.log('Done checking the merkle roots')

  console.log('Setting up listeners for token contracts...')

  const tokenContracts = Object.keys(ledger)

  for (const tokenAddress of tokenContracts) {
    const contract = new Contract(tokenAddress, erc721abi, provider)
    contract.on(contract.filters.Transfer(), async () => {
      console.log(
        `Transfer event on ${tokenAddress}, checking the contract roots...`
      )
      const currentMerkleRoot = ledger[tokenAddress].merkleRoot
      await checkContractRoot(tokenAddress, currentMerkleRoot)
    })
  }
  setTimeout(main, 5 * 60 * 1000)
})()
