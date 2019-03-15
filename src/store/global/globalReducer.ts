import * as Actions from 'store/global/globalActions'
import AppState from 'store/AppState'
import { createReducers } from 'store/storeHelpers'

type GlobalState = AppState['global']

const initialData: GlobalState = {
  loading: true,
  error: undefined,
}

export default createReducers(initialData, (state: GlobalState) => ({

  [Actions.GLOBAL_MODIFY.START]: () => ({
    ...state,
    loading: true,
  }),

  [Actions.GLOBAL_MODIFY.SUCCESS]: () => ({
    ...state,
    loading: false,
  }),

  [Actions.GLOBAL_MODIFY.ERROR]: (action: Actions.GlobalModifyAction['error']) => ({
    ...state,
    loading: false,
    error: action.error,
  }),

}))
