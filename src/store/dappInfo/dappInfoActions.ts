import { AsyncAction, AsyncActionCreator, Dispatch } from 'store/storeHelpers'
import AppState from 'store/AppState'
import DappInfoStorage from 'utils/storage/DappInfoStorage'
import { DappInfo } from 'utils/manifest/DappInfo'

const dappInfoStorage = new DappInfoStorage()

export const DAPP_INFO_MODIFY = {
  START: 'DAPP_INFO_MODIFY_START',
  SUCCESS: 'DAPP_INFO_MODIFY_SUCCESS',
  ERROR: 'DAPP_INFO_MODIFY_ERROR',
}

export type DappInfoModifyAction = AsyncAction<{}, {
  dappInfo: DappInfo,
}, {
  error: Error,
}>

export const dappInfoModifyAsync: AsyncActionCreator = {
  start: (): DappInfoModifyAction['start'] => ({
    type: DAPP_INFO_MODIFY.START,
  }),

  success: (dappInfo: DappInfo): DappInfoModifyAction['success'] => ({
    type: DAPP_INFO_MODIFY.SUCCESS,
    dappInfo,
  }),

  error: (error: Error): DappInfoModifyAction['error'] => ({
    type: DAPP_INFO_MODIFY.ERROR,
    error,
  }),
}

export const dappInfoFetch = () => async (dispatch: Dispatch, getState: () => AppState) => {
  // Check if the dappInfo has already been fetched from storage.
  let dappInfo = getState().dappInfo.data
  if (dappInfo) {
    dispatch(dappInfoModifyAsync.success(dappInfo))
    return
  }

  dispatch(dappInfoModifyAsync.start())
  try {
    dappInfo = await dappInfoStorage.getDappInfo()
    await dappInfoStorage.clear()
    dispatch(dappInfoModifyAsync.success(dappInfo))
  } catch (e) {
    dispatch(dappInfoModifyAsync.error(e))
  }
}
