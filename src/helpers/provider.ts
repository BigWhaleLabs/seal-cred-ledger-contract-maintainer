import { providers } from 'ethers'
import env from '@/helpers/env'

export default new providers.InfuraProvider(env.ETH_NETWORK, {
  projectId: env.INFURA_PROJECT_ID,
})
