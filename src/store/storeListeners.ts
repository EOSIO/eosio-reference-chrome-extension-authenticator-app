import InsecureModeListeners from 'store/insecureMode/insecureModeListeners'
import AuthsListeners from 'store/auths/authsListeners'
import PassphraseListeners from 'store/passphrase/passphraseListeners'
import RequestListeners from 'store/request/requestListeners'

const listeners = [
  new AuthsListeners(),
  new InsecureModeListeners(),
  new PassphraseListeners(),
  new RequestListeners(),
]

export const getStoreListeners = () => listeners

export const startStoreListeners = () => {
  listeners.forEach((listener) => listener.start())
}

export const stopStoreListeners = () => {
  listeners.forEach((listener) => listener.stop())
}
