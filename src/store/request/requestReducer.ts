import * as Actions from 'store/request/requestActions'
import AppState from 'store/AppState'
import { createReducers } from 'store/storeHelpers'

type RequestState = AppState['request']

const initialData: RequestState = {
  data: null,
  loading: false,
  error: undefined,
}

export default createReducers(initialData, (state: RequestState) => ({

  [Actions.REQUEST_MODIFY.START]: () => ({
    ...state,
    loading: true,
  }),

  [Actions.REQUEST_MODIFY.SUCCESS]: (action: Actions.RequestModifyAction['success']) => ({
    ...state,
    loading: false,
    data: action.request,
  }),

  [Actions.REQUEST_MODIFY.ERROR]: (action: Actions.RequestModifyAction['error']) => ({
    ...state,
    loading: false,
    error: action.error,
  }),

}))
