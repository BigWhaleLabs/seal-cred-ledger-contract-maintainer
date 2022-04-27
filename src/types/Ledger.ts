import { ERC721 } from '@big-whale-labs/street-cred-ledger-contract'

type Ledger = {
  [tokenAddress: string]: { contract: ERC721; merkleRoot: string }
}

export default Ledger
