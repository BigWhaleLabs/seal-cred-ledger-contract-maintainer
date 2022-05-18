import * as dotenv from 'dotenv'
import {
  ETH_NETWORK,
  ETH_RPC,
  SCLEDGER_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import { cleanEnv, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  ETH_NETWORK: str({ default: ETH_NETWORK }),
  ETH_RPC: str({ default: ETH_RPC }),
  SCLEDGER_CONTRACT_ADDRESS: str({ default: SCLEDGER_CONTRACT_ADDRESS }),
  CONTRACT_OWNER_PRIVATE_KEY: str(),
})
