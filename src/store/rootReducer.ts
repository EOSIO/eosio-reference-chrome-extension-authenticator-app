import { combineReducers } from 'redux'
import AppState from 'store/AppState'
import global from 'store/global/globalReducer'
import passphraseHash from 'store/passphrase/passphraseReducer'
import auths from 'store/auths/authsReducer'
import dappInfo from 'store/dappInfo/dappInfoReducer'
import request from 'store/request/requestReducer'
import insecureMode from 'store/insecureMode/insecureModeReducer'

export default combineReducers<AppState>({
  auths,
  dappInfo,
  global,
  insecureMode,
  passphraseHash,
  request,
})
