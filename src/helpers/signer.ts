import { Wallet } from 'ethers'
import env from '@/helpers/env'
import provider from '@/helpers/provider'

export default new Wallet(env.CONTRACT_OWNER_PRIVATE_KEY, provider)
