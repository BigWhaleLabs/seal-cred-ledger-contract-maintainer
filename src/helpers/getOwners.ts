import allContracts from '@/helpers/allContracts'

export default function (contractAddress: string) {
  const tokenIdToOwner = allContracts[contractAddress]
  return Array.from(new Set(Object.values(tokenIdToOwner)))
}
