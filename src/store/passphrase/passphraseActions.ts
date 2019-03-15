import { Dispatch } from 'redux'
import { sha256 } from 'hash.js'

import AuthStorage from 'utils/storage/AuthStorage'
import PassphraseHashStorage from 'utils/storage/PassphraseHashStorage'
import { AsyncAction, AsyncActionCreator } from 'store/storeHelpers'
import { reEncryptAuths } from 'utils/encrypter'

const authStorage = new AuthStorage()
const passphraseHashStorage = new PassphraseHashStorage()

export const PASSPHRASE_MODIFY = {
  START: 'PASSPHRASE_MODIFY_START',
  SUCCESS: 'PASSPHRASE_MODIFY_SUCCESS',
  ERROR: 'PASSPHRASE_MODIFY_ERROR',
}

export type PassphraseModifyAction = AsyncAction<{}, {
  passphraseHash: string,
}, {
  error: Error,
}>

export const passphraseModifyAsync: AsyncActionCreator = {
  start: (): PassphraseModifyAction['start'] => ({
    type: PASSPHRASE_MODIFY.START,
  }),

  success: (passphraseHash: string): PassphraseModifyAction['success'] => ({
    type: PASSPHRASE_MODIFY.SUCCESS,
    passphraseHash,
  }),

  error: (error: Error): PassphraseModifyAction['error'] => ({
    type: PASSPHRASE_MODIFY.ERROR,
    error,
  }),
}

export const passphraseFetch = () => async (dispatch: Dispatch) => {
  dispatch(passphraseModifyAsync.start())
  try {
    const passphraseHash = await passphraseHashStorage.get()
    dispatch(passphraseModifyAsync.success(passphraseHash))
  } catch (e) {
    dispatch(passphraseModifyAsync.error(e))
  }
}

export const passphraseAdd = (phrase: string) => async (dispatch: Dispatch) => {
  dispatch(passphraseModifyAsync.start())
  try {
    const phraseHash = sha256().update(phrase).digest('hex')
    await passphraseHashStorage.set(phraseHash)
    dispatch(passphraseModifyAsync.success(phraseHash))
  } catch (e) {
    dispatch(passphraseModifyAsync.error(e))
  }
}

export const passphraseUpdate = (currentPassphrase: string, newPassphrase: string) => async (dispatch: Dispatch) => {
  dispatch(passphraseModifyAsync.start())

  try {
    const auths = await authStorage.get()
    const newAuths = await reEncryptAuths(auths, currentPassphrase, newPassphrase)
    const phraseHash = sha256().update(newPassphrase).digest('hex')

    await authStorage.set(newAuths)
    await passphraseHashStorage.set(phraseHash)
    dispatch(passphraseModifyAsync.success(phraseHash))
  } catch (e) {
    dispatch(passphraseModifyAsync.error(e))
  }
}
