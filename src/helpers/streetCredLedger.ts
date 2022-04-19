import { StreetCredLedger__factory } from '@big-whale-labs/street-cred-ledger-contract'
import env from '@/helpers/env'
import provider from '@/helpers/provider'

export default StreetCredLedger__factory.connect(env.CONTRACT_ADDRESS, provider)
