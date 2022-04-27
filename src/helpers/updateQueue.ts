import { StreetCredLedger } from '@big-whale-labs/street-cred-ledger-contract'
import checkContractRoot from '@/helpers/checkContractRoot'
import ledger from '@/helpers/Ledger'
import streetCredLedger from '@/helpers/streetCredLedger'

const updateQueue = [] as string[]

async function check() {
  console.log('Checking events...')
  const tokenAddressesToCheck = Array.from(
    new Set(updateQueue.splice(0, updateQueue.length))
  )
  if (!tokenAddressesToCheck.length) {
    console.log('No contract addresses to check')
    return
  }
  const mismatchRoots = (
    await Promise.all(
      tokenAddressesToCheck.map((address) =>
        checkContractRoot(address, ledger[address].merkleRoot)
      )
    )
  ).filter((v) => !!v) as StreetCredLedger.RootStruct[]

  console.log('Updating merkle roots:')
  console.log(mismatchRoots)
  try {
    await streetCredLedger.setRoots(mismatchRoots)
  } catch (error) {
    console.error(`Failed to set the merkle roots: ${error}`)
  }
}

export function startCheckingUpdateQueue() {
  setInterval(check, 5 * 60 * 1000)
}

export function addAddressToUpdateQueue(tokenAddress: string) {
  console.log(
    `Transfer event on ${tokenAddress}, adding token address to updateQueue`
  )
  updateQueue.push(tokenAddress)
}
