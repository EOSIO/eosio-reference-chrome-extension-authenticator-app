import { Abi } from 'eosjs/dist/eosjs-rpc-interfaces'

const EOSIO_ASSERT_ACCOUNT = 'eosio.assert'
const EOSIO_ASSERT_ACTION = 'require'

export interface TransactionInfo {
  actions: Action[]
}

export interface Action {
  account: string
  name: string
  authorization: PermissionLevel[]
  data: any
}

export interface PermissionLevel {
  actor: string
  permission: string
}

export interface AbiInfo {
  abi: Abi
  accountName: string
}

export const isAssertRequireAction = (action: Action) => {
  return action.account === EOSIO_ASSERT_ACCOUNT && action.name === EOSIO_ASSERT_ACTION
}
