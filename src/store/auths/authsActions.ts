import { privateToPublic } from 'eosjs-ecc'
import { sha256 } from 'hash.js'

import { Dispatch } from 'store/storeHelpers'
import { AsyncAction, AsyncActionCreator } from 'store/storeHelpers'
import AppState, { DelayedRemovable } from 'store/AppState'
import Auth from 'utils/Auth'
import AuthStorage from 'utils/storage/AuthStorage'
import { encrypt } from 'utils/encrypter'
import { isValidPrivate } from 'eosjs-ecc'

const REMOVE_DELAY = 6000

const authStorage = new AuthStorage()

const removingAuthMap: {
  [publicKey: string]: NodeJS.Timeout
} = {}

export const AUTHS_MODIFY = {
  START: 'AUTHS_MODIFY_START',
  SUCCESS: 'AUTHS_MODIFY_SUCCESS',
  ERROR: 'AUTHS_MODIFY_ERROR',
}

export const AUTHS_MARK_FOR_REMOVAL = 'AUTHS_MARK_FOR_REMOVAL'

export type AuthsModifyAction = AsyncAction<{}, {
  auths: Array<DelayedRemovable<Auth>>,
}, {
  error: Error,
}>

export interface AuthsMarkForRemovalAction {
  type: 'AUTHS_MARK_FOR_REMOVAL'
  publicKey: string
  removing: boolean
}

export const authsModifyAsync: AsyncActionCreator = {
  start: (): AuthsModifyAction['start'] => ({
    type: AUTHS_MODIFY.START,
  }),

  success: (auths: Array<DelayedRemovable<Auth>>): AuthsModifyAction['success'] => ({
    type: AUTHS_MODIFY.SUCCESS,
    auths,
  }),

  error: (error: Error): AuthsModifyAction['error'] => ({
    type: AUTHS_MODIFY.ERROR,
    error,
  }),
}

export const authMarkForRemoval = (publicKey: string, removing: boolean): AuthsMarkForRemovalAction => ({
  type: AUTHS_MARK_FOR_REMOVAL,
  publicKey,
  removing,
})

export const authsFetch = () => async (dispatch: Dispatch) => {
  dispatch(authsModifyAsync.start())
  try {
    const auths = await authStorage.get()
    dispatch(authsModifyAsync.success(auths))
  } catch (e) {
    dispatch(authsModifyAsync.error(e))
  }
}

export const authAdd = (nickname: string, privateKey: string, passphrase: string) =>
  async (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(authsModifyAsync.start())
    try {
      const auths = getState().auths.data || []
      const storedPassphraseHash = getState().passphraseHash.data
      const passphraseHash = sha256().update(passphrase).digest('hex')

      if (storedPassphraseHash !== passphraseHash) {
        throw new Error('Invalid Passphrase')
      }

      if (!isValidPrivate(privateKey)) {
        throw new Error('Invalid private key')
      }

      const index = auths.findIndex((auth) => {
        return auth.nickname === nickname
      })

      if (index !== -1) {
        throw new Error('Key name already exists')
      }

      auths.push({
        nickname,
        encryptedPrivateKey: await encrypt(privateKey, passphrase),
        publicKey: privateToPublic(privateKey),
      })
      await authStorage.set(auths)
      dispatch(authsModifyAsync.success(auths))
    } catch (e) {
      dispatch(authsModifyAsync.error(e))
    }
  }

export const authUpdate = (currentNickname: string, newNickname: string) =>
  async (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(authsModifyAsync.start())
    try {
      const auths = getState().auths.data || []

      const index = auths.findIndex((auth) => {
        return auth.nickname === currentNickname
      })

      if (index === -1) {
        throw new Error(`Key with name '${currentNickname}' not found.`)
      }

      const newAuths = auths.map((item, idx) => {
        if (idx !== index) {
          return item
        } else {
          return {
            ...item,
            nickname: newNickname,
          }
        }
      })

      await authStorage.set(newAuths)

      dispatch(authsModifyAsync.success(newAuths))
    } catch (e) {
      dispatch(authsModifyAsync.error(e))
    }
  }

export const authDelayedRemove = (publicKey: string) => async (dispatch: Dispatch, getState: () => AppState) => {
  if (removingAuthMap[publicKey] != null) {
    return
  }

  dispatch(authMarkForRemoval(publicKey, true))

  const auths = getState().auths.data
  await authStorage.set(auths)

  const timeoutId = createAuthRemovalTimeout(publicKey, dispatch, getState)
  removingAuthMap[publicKey] = timeoutId
}

const createAuthRemovalTimeout = (publicKey: string, dispatch: Dispatch, getState: () => AppState): NodeJS.Timeout => {
  return setTimeout(() => {
    const auths = getState().auths.data
    const index = auths.findIndex((auth) => (auth.publicKey === publicKey && auth.removing))

    if (index < 0) {
      return
    }

    authRemove(publicKey)(dispatch, getState)
  }, REMOVE_DELAY)
}

export const authDelayedRemoveUndo = (publicKey: string) => async (dispatch: Dispatch) => {
  dispatch(authMarkForRemoval(publicKey, false))

  const timeoutId = removingAuthMap[publicKey]
  if (timeoutId) {
    clearTimeout(timeoutId)
    delete removingAuthMap[publicKey]
  }
}

export const authRemove = (publicKey: string) => async (dispatch: Dispatch, getState: () => AppState) => {
  const auths = getState().auths.data
  const index = auths.findIndex((auth) => (auth.publicKey === publicKey))

  dispatch(authsModifyAsync.start())
  try {
    if (index >= 0) {
      auths.splice(index, 1)
      await authStorage.set(auths)
    }

    dispatch(authsModifyAsync.success(auths))
  } catch (e) {
    dispatch(authsModifyAsync.error(e))
  }
}
