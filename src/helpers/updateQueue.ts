import { SealCredLedger } from '@big-whale-labs/seal-cred-ledger-contract'
import { schedule } from 'node-cron'
import checkContractRoot from '@/helpers/checkContractRoot'
import ledger from '@/helpers/ledger'
import sealCredLedger from '@/helpers/sealCredLedger'

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
  ).filter((v) => !!v) as SealCredLedger.RootStruct[]
  if (!mismatchRoots.length) {
    console.log('No mismatched roots found')
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
  }
  checking = true
  try {
    await check()
  } finally {
    checking = false
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
  updateQueue.push(tokenAddress)
}
