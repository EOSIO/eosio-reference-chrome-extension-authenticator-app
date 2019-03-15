import AppState from 'store/AppState'
import { createReducers } from 'store/storeHelpers'
import * as Actions from 'store/auths/authsActions'

type AuthsState = AppState['auths']

const initialData: AuthsState = {
  data: [],
  loading: false,
  error: undefined,
}

export default createReducers(initialData, (state: AuthsState) => ({

  [Actions.AUTHS_MODIFY.START]: () => ({
    ...state,
    loading: true,
  }),

  [Actions.AUTHS_MODIFY.SUCCESS]: (action: Actions.AuthsModifyAction['success']) => ({
    ...state,
    loading: false,
    data: action.auths,
  }),

  [Actions.AUTHS_MODIFY.ERROR]: (action: Actions.AuthsModifyAction['error']) => ({
    ...state,
    loading: false,
    error: action.error,
  }),

  [Actions.AUTHS_MARK_FOR_REMOVAL]: (action: Actions.AuthsMarkForRemovalAction) => {
    const data = state.data.map((auth) => {
      if (auth.publicKey !== action.publicKey) {
        return auth
      }

      return {
        ...auth,
        removing: action.removing,
      }
    })

    return {
      ...state,
      data,
    }
  },

}))
