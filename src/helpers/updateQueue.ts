import { SealCredLedger } from '@big-whale-labs/seal-cred-ledger-contract'
import { schedule } from 'node-cron'
import checkContractRoot from '@/helpers/checkContractRoot'
import ledger from '@/helpers/Ledger'
import sealCredLedger from '@/helpers/sealCredLedger'

const updateQueue = {} as { [contractAddress: string]: Date }

async function check() {
  console.log('Checking events...')
  // Get contracts that were added no earlier than hour ago
  const tokenAddressesToCheck = Object.entries(updateQueue)
    .filter(
      ([, addedToQueue]) =>
        Date.now() - addedToQueue.getTime() < 4 * 60 * 60 * 1000 // 4 hours
    )
    .map(([contractAddress]) => contractAddress)
  if (!tokenAddressesToCheck.length) {
    console.log('No contract addresses to check')
    return
  }
  console.log(`Got ${tokenAddressesToCheck.length} contracts to check`)
  const mismatchRoots = (
    await Promise.all(
      tokenAddressesToCheck.map((address) =>
        checkContractRoot(address, ledger[address].merkleRoot)
      )
    )
  ).filter((v) => !!v) as SealCredLedger.RootStruct[]

  if (!mismatchRoots.length) {
    console.log('No mismatches found')
    return
  }

  console.log('Updating merkle roots:')
  console.log(mismatchRoots)
  try {
    const tx = await sealCredLedger.setRoots(mismatchRoots)
    await tx.wait()
    console.log(`Updated ${mismatchRoots.length} merkle roots`)
  } catch (error) {
    console.error(`Failed to set the merkle roots: ${error}`)
  }
}

let checking = false
async function checkWithSemaphore() {
  if (checking) {
    console.log('Not checking events, already in progress')
    return
  }
  checking = true
  console.log('Turned on checking semaphore')
  try {
    await check()
  } finally {
    checking = false
    console.log('Turned off checking semaphore')
  }
}

export function startCheckingUpdateQueue() {
  // Run now
  void checkWithSemaphore()
  // And every 5 minutes
  schedule('*/5 * * * *', checkWithSemaphore)
}

export function addAddressToUpdateQueue(tokenAddress: string) {
  console.log(
    `Transfer event on ${tokenAddress}, adding token address to updateQueue`
  )
  updateQueue[tokenAddress] = new Date()
}
