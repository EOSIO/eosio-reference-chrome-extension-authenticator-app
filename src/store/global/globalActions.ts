import { AsyncAction, AsyncActionCreator, Dispatch } from 'store/storeHelpers'
import { requestFetch } from 'store/request/requestActions'
import { authsFetch } from 'store/auths/authsActions'
import { dappInfoFetch } from 'store/dappInfo/dappInfoActions'
import { insecureModeFetch } from 'store/insecureMode/insecureModeActions'
import { passphraseFetch } from 'store/passphrase/passphraseActions'

export const GLOBAL_MODIFY = {
  START: 'GLOBAL_MODIFY_START',
  SUCCESS: 'GLOBAL_MODIFY_SUCCESS',
  ERROR: 'GLOBAL_MODIFY_ERROR',
}

export type GlobalModifyAction = AsyncAction<{}, {}, {
  error: Error,
}>

export const globalModifyAsync: AsyncActionCreator = {
  start: (): GlobalModifyAction['start'] => ({
    type: GLOBAL_MODIFY.START,
  }),

  success: (): GlobalModifyAction['success'] => ({
    type: GLOBAL_MODIFY.SUCCESS,
  }),

  error: (error: Error): GlobalModifyAction['error'] => ({
    type: GLOBAL_MODIFY.ERROR,
    error,
  }),
}

export const globalLoad = () => async (dispatch: Dispatch) => {
  dispatch(globalModifyAsync.start())
  try {
    await Promise.all([
      dispatch(authsFetch()),
      dispatch(dappInfoFetch()),
      dispatch(requestFetch()),
      dispatch(insecureModeFetch()),
      dispatch(passphraseFetch()),
    ])
    dispatch(globalModifyAsync.success())
  } catch (e) {
    dispatch(globalModifyAsync.error(e))
  }
}
