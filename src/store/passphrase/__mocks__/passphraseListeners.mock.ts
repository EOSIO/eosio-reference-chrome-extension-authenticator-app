import * as PassphraseListeners from 'store/passphrase/passphraseListeners'

export const start = jest.fn()
export const stop = jest.fn()

jest.spyOn(PassphraseListeners, 'default').mockImplementation(() => ({
  start,
  stop,
}))
