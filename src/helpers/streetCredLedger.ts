import { StreetCredLedger__factory } from '@big-whale-labs/street-cred-ledger-contract'
import env from '@/helpers/env'
import signer from '@/helpers/signer'

export default StreetCredLedger__factory.connect(env.CONTRACT_ADDRESS, signer)
