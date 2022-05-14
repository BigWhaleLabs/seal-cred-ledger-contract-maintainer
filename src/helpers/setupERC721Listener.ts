import { ERC721 } from '@big-whale-labs/seal-cred-ledger-contract'
import { addAddressToUpdateQueue } from '@/helpers/updateQueue'
import allContracts from '@/helpers/allContracts'

export default function setupERC721Listener(contract: ERC721) {
  contract.on(contract.filters.Transfer(), (_, to, tokenId) => {
    allContracts[contract.address][tokenId.toNumber()] = to
    addAddressToUpdateQueue(contract.address)
  })
}
