import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'
import { poseidon } from 'circomlibjs'

export default function getMerkleRoot(owners: string[]) {
  const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)

  for (const owner of owners) {
    tree.insert(BigInt(owner))
  }
  return `0x${tree.root.toString(16)}`
}
