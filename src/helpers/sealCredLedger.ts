import { SealCredLedger__factory } from '@big-whale-labs/seal-cred-ledger-contract'
import env from '@/helpers/env'
import signer from '@/helpers/signer'

export default SealCredLedger__factory.connect(
  env.SCLEDGER_CONTRACT_ADDRESS,
  signer
)
