import { StreetCredLedger } from '@big-whale-labs/street-cred-ledger-contract'
import checkContractRoot from '@/helpers/checkContractRoot'
import ledger from '@/helpers/Ledger'
import streetCredLedger from '@/helpers/streetCredLedger'

const addressQueue = [] as string[]

async function check() {
  console.log('Checking events...')
  const tokenAddresses = addressQueue.splice(0, addressQueue.length)
  if (!tokenAddresses.length) {
    console.log('No contract addresses to check')
    return
  }
  const mismatchRoots = [] as StreetCredLedger.RootStruct[]
  for (const tokenAddress of tokenAddresses) {
    const currentMerkleRoot = ledger[tokenAddress].merkleRoot
    await checkContractRoot(tokenAddress, currentMerkleRoot, mismatchRoots)
  }

  try {
    await streetCredLedger.setRoots(mismatchRoots)
  } catch (error) {
    console.error(`Failed to set the merkle root: ${error}`)
  }
}

export function startCheckingTransferEvents() {
  setInterval(check, 5 * 60 * 1000)
}

export function addTokenAddress(tokenAddress: string) {
  addressQueue.push(tokenAddress)
}
