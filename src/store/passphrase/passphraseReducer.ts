import * as Actions from 'store/passphrase/passphraseActions'
import AppState from 'store/AppState'
import { createReducers } from 'store/storeHelpers'

type PassphraseState = AppState['passphraseHash']

const initialState: PassphraseState = {
  data: null,
  loading: false,
  error: null,
}

export default createReducers(initialState, (state: PassphraseState) => ({

  [Actions.PASSPHRASE_MODIFY.START]: () => ({
    ...state,
    loading: true,
  }),

  [Actions.PASSPHRASE_MODIFY.SUCCESS]: (action: Actions.PassphraseModifyAction['success']) => ({
    ...state,
    loading: false,
    data: action.passphraseHash,
    error: null,
  }),

  [Actions.PASSPHRASE_MODIFY.ERROR]: (action: Actions.PassphraseModifyAction['error']) => ({
    ...state,
    loading: false,
    error: action.error,
  }),

}))
