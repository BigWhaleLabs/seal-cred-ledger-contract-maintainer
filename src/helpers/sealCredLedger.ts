import { SealCredLedger__factory } from '@big-whale-labs/seal-cred-ledger-contract'
import env from '@/helpers/env'
import signer from '@/helpers/signer'

export default SealCredLedger__factory.connect(env.CONTRACT_ADDRESS, signer)
