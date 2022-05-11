import { providers } from 'ethers'
import env from '@/helpers/env'

export default new providers.WebSocketProvider(env.ETH_WS, env.ETH_NETWORK)
