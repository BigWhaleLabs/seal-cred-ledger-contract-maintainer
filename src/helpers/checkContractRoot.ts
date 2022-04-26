import { utils } from 'ethers'
import getMerkleRoot from '@/helpers/getMerkleRoot'
import getOwners from '@/helpers/getOwners'
import streetCredLedger from '@/helpers/streetCredLedger'

export default async function checkContractRoot(
  tokenAddress: string,
  currentMerkleRoot: string
) {
  const owners = await getOwners(tokenAddress)
  if (owners.length === 0) return

  const expectedMerkleRoot = utils.hexZeroPad(await getMerkleRoot(owners), 32)
  if (currentMerkleRoot !== expectedMerkleRoot) {
    console.log(
      `For contract: ${tokenAddress}, merkle root mismatch: got ${currentMerkleRoot}, expected ${expectedMerkleRoot}, fixing...`
    )
    try {
      await streetCredLedger.setRoot(tokenAddress, expectedMerkleRoot)
    } catch (error) {
      console.error(`Failed to set the merkle root: ${error}`)
    }
  }
}
