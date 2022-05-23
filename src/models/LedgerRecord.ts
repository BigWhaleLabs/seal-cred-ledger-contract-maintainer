import { ERC721 } from '@big-whale-labs/seal-cred-ledger-contract'

export default interface LedgerRecord {
  merkleRoot: string
  originalContract: ERC721
}
