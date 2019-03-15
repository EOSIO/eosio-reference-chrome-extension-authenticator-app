import * as Actions from 'store/insecureMode/insecureModeActions'
import AppState from 'store/AppState'
import { createReducers } from 'store/storeHelpers'

type InsecureModeState = AppState['insecureMode']

const initialData: InsecureModeState = {
  data: {
    enabled: false,
    whitelist: [],
  },
  loading: false,
  error: null,
}

export default createReducers(initialData, (state: InsecureModeState) => ({

  [Actions.INSECURE_MODE_MODIFY.START]: () => ({
    ...state,
    loading: true,
  }),

  [Actions.INSECURE_MODE_MODIFY.SUCCESS]: (action: Actions.InsecureModeModifyAction['success']) => ({
    ...state,
    loading: false,
    data: action.insecureMode,
    error: null,
  }),

  [Actions.INSECURE_MODE_MODIFY.ERROR]: (action: Actions.InsecureModeModifyAction['error']) => ({
    ...state,
    loading: false,
    error: action.error,
  }),

}))
