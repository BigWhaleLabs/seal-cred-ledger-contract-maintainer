import { ERC721__factory } from '@big-whale-labs/seal-cred-ledger-contract'
import ledger from '@/helpers/ledger'
import provider from '@/helpers/provider'
import setupERC721Listener from '@/helpers/setupERC721Listener'
import streetCredLedger from '@/helpers/sealCredLedger'

export default function setupStreetCredLedgerListeners() {
  streetCredLedger.on(
    streetCredLedger.filters.SetMerkleRoot(),
    (tokenAddress, merkleRoot) => {
      if (!ledger[tokenAddress]) {
        const contract = ERC721__factory.connect(tokenAddress, provider)
        ledger[tokenAddress] = {
          merkleRoot,
          originalContract: contract,
        }
        setupERC721Listener(contract)
      } else {
        ledger[tokenAddress].merkleRoot = merkleRoot
      }
    }
  )
  streetCredLedger.on(
    streetCredLedger.filters.DeleteMerkleRoot(),
    (tokenAddress) => {
      ledger[tokenAddress].originalContract.removeAllListeners()
      delete ledger[tokenAddress]
    }
  )
}
