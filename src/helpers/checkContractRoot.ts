import { BytesLike, utils } from 'ethers'
import { StreetCredLedger } from '@big-whale-labs/street-cred-ledger-contract'
import getMerkleRoot from '@/helpers/getMerkleRoot'
import getOwners from '@/helpers/getOwners'

export default async function checkContractRoot(
  tokenAddress: string,
  currentMerkleRoot: BytesLike
) {
  const owners = await getOwners(tokenAddress)
  if (owners.length === 0) {
    console.log('No minted owners from this contract')
    return
  }

  const expectedMerkleRoot = utils.hexZeroPad(getMerkleRoot(owners), 32)
  if (currentMerkleRoot !== expectedMerkleRoot) {
    console.log(
      `For contract: ${tokenAddress}, merkle root mismatch: got ${currentMerkleRoot}, expected ${expectedMerkleRoot}`
    )
    const mismatchRootFix: StreetCredLedger.RootStruct = {
      tokenAddress,
      merkleRoot: expectedMerkleRoot,
    }
    return mismatchRootFix
  }
}
