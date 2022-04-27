import { ERC721 } from '@big-whale-labs/street-cred-ledger-contract'
import { addAddressToUpdateQueue } from '@/helpers/updateQueue'

export default function setupERC721Listener(contract: ERC721) {
  contract.on(contract.filters.Transfer(), () => {
    addAddressToUpdateQueue(contract.address)
  })
}
