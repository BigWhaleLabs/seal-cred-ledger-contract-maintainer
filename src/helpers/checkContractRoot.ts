import addZerosToHex from '@/helpers/addZerosToHex'
import getMerkleRoot from '@/helpers/getMerkleRoot'
import getOwners from '@/helpers/getOwners'
import streetCredLedger from '@/helpers/streetCredLedger'

export default async function checkContractRoot(
  tokenAddress: string,
  currentMerkleRoot: string
) {
  const owners = await getOwners(tokenAddress)
  if (owners.length === 0) return

  const expectedMerkleRoot = addZerosToHex(await getMerkleRoot(owners))
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
