import Auth from 'utils/Auth'
import { DappInfo } from 'utils/manifest/DappInfo'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'
import DappRequest from 'utils/requests/DappRequest'

export interface AsyncState<T> {
  data?: T
  loading: boolean
  error: Error
}

export type DelayedRemovable<T> = Extend<T, {
  removing?: boolean
}>

export default interface AppState {
  auths: AsyncState<Array<DelayedRemovable<Auth>>>
  dappInfo: AsyncState<DappInfo>
  global: AsyncState<null>
  insecureMode: AsyncState<InsecureMode>
  passphraseHash: AsyncState<string>,
  request: AsyncState<DappRequest>
}
