import AppState from 'store/AppState'
import { createReducers } from 'store/storeHelpers'
import * as Actions from 'store/dappInfo/dappInfoActions'

type DappInfoState = AppState['dappInfo']

const initialData: DappInfoState = {
  data: null,
  loading: false,
  error: undefined,
}

export default createReducers(initialData, (state: DappInfoState) => ({

  [Actions.DAPP_INFO_MODIFY.START]: () => ({
    ...state,
    loading: true,
  }),

  [Actions.DAPP_INFO_MODIFY.SUCCESS]: (action: Actions.DappInfoModifyAction['success']) => ({
    ...state,
    loading: false,
    data: action.dappInfo,
  }),

  [Actions.DAPP_INFO_MODIFY.ERROR]: (action: Actions.DappInfoModifyAction['error']) => ({
    ...state,
    loading: false,
    error: action.error,
  }),

}))
