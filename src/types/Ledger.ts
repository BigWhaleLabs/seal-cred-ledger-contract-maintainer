import { Contract } from 'ethers'

type Ledger = {
  [tokenAddress: string]: { contract: Contract; merkleRoot: string }
}

export default Ledger
