import { BytesLike, utils } from 'ethers'
import { SealCredLedger } from '@big-whale-labs/seal-cred-ledger-contract'
import getMerkleRoot from '@/helpers/getMerkleRoot'
import getOwners from '@/helpers/getOwners'

export default function checkContractRoot(
  tokenAddress: string,
  currentMerkleRoot: BytesLike
) {
  console.log(`Checking merkle root for ${tokenAddress}`)
  const owners = getOwners(tokenAddress)
  if (owners.length === 0) {
    console.log('No minted owners from this contract')
    return
  }

  const expectedMerkleRoot = utils.hexZeroPad(getMerkleRoot(owners), 32)
  if (currentMerkleRoot !== expectedMerkleRoot) {
    console.log(
      `For contract: ${tokenAddress}, merkle root mismatch: got ${currentMerkleRoot}, expected ${expectedMerkleRoot}`
    )
    const mismatchRootFix: SealCredLedger.RootStruct = {
      tokenAddress,
      merkleRoot: expectedMerkleRoot,
    }
    return mismatchRootFix
  } else {
    console.log(
      `For contract: ${tokenAddress}, merkle roots match: ${currentMerkleRoot}`
    )
  }
}
