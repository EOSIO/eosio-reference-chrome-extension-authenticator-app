import * as authStorageMocks from 'utils/storage/__mocks__/AuthStorage.mock'
import * as encrypter from 'utils/__mocks__/encrypter.mock'

import * as ecc from 'eosjs-ecc'
import * as hashjs from 'hash.js'

import * as actions from 'store/auths/authsActions'
import Auth from 'utils/Auth'
import { DelayedRemovable } from 'store/AppState'

declare var global: any

describe('Auths Actions', () => {
  let dispatch: jest.Mock
  let getState: jest.Mock
  let auth1: DelayedRemovable<Auth>
  let auth2: DelayedRemovable<Auth>

  beforeEach(() => {
    jest.clearAllMocks()

    global.setTimeout = jest.fn((callback) => {
      callback()
      return 'timeoutId'
    })
    global.clearTimeout = jest.fn()

    jest.spyOn(ecc, 'privateToPublic').mockImplementation((privateKey: string) => {
      if (privateKey.toLowerCase() === 'privatekey1') {
        return 'publicKey1'
      }

      if (privateKey.toLowerCase() === 'privatekey2') {
        return 'publicKey2'
      }

      return null
    })

    encrypter.encrypt.mockImplementation((privateKey, passphrase) => (`encrypted${privateKey}`))

    dispatch = jest.fn()
    getState = jest.fn()

    auth1 = {
      encryptedPrivateKey: 'encryptedPrivateKey1',
      publicKey: 'publicKey1',
      nickname: 'name1',
    }

    auth2 = {
      encryptedPrivateKey: 'encryptedPrivateKey2',
      publicKey: 'publicKey2',
      nickname: 'name2',
    }

    authStorageMocks.get.mockReturnValue([ auth1, auth2 ])
    authStorageMocks.set.mockReturnValue(null)
  })

  describe('authsFetch', () => {
    it('starts auths fetch', async () => {
      await actions.authsFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.start())
    })

    it('succeeds with fetched auths', async () => {
      await actions.authsFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success([ auth1, auth2 ]))
    })

    it('dispatches error on storage error', async () => {
      const error = new Error()
      authStorageMocks.get.mockRejectedValue(error)
      await actions.authsFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })
  })

  describe('authAdd', () => {
    beforeEach(() => {
      jest.spyOn(hashjs, 'sha256').mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('passphraseHash'),
        }),
      })

      getState.mockReturnValue({
        auths: {
          data: [auth1],
        },
        passphraseHash: {
          data: 'passphraseHash',
        },
      })
    })

    it('starts auth add', async () => {
      await actions.authAdd('name2', 'PrivateKey2', 'passphrase')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.start())
    })

    it('encrypts the auth private key', async () => {
      jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)
      await actions.authAdd('name2', 'PrivateKey2', 'passphrase')(dispatch, getState)
      expect(encrypter.encrypt).toHaveBeenCalledWith('PrivateKey2', 'passphrase')
    })

    it('succeeds with added auth if there is already an auth', async () => {
      await actions.authAdd('name2', 'PrivateKey2', 'passphrase')(dispatch, getState)

      expect(authStorageMocks.set).toHaveBeenCalledWith([
        auth1,
        auth2,
      ])

      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success([
        auth1,
        auth2,
      ]))
    })

    it('succeeds with added auth if there is not already an auth', async () => {
      getState.mockReturnValue({
        auths: {
          data: [],
        },
        passphraseHash: {
          data: 'passphraseHash',
        },
      })
      jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)

      await actions.authAdd('name2', 'PrivateKey2', 'passphrase')(dispatch, getState)
      expect(authStorageMocks.set).toHaveBeenCalledWith([
        auth2,
      ])

      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success([
        auth2,
      ]))
    })

    it('succeeds with added auth if auth state is empty', async () => {
      getState.mockReturnValue({
        auths: {
        },
        passphraseHash: {
          data: 'passphraseHash',
        },
      })
      jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)

      await actions.authAdd('name2', 'PrivateKey2', 'passphrase')(dispatch, getState)
      expect(authStorageMocks.set).toHaveBeenCalledWith([
        auth2,
      ])

      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success([
        auth2,
      ]))
    })

    it('dispatches error when duplicate key name is added error', async () => {
      const error = new Error('Key name already exists')
      authStorageMocks.set.mockRejectedValue(error)
      await actions.authAdd('name1', 'PrivateKey1', 'blah')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })

    it('dispatches invalid key error if the private key is invalid', async () => {
      const error = new Error('Invalid private key')
      jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(false)
      await actions.authAdd('name1', 'PrivateKey1', 'blah')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })

    it('dispatches error when passphrase hashes do not match', async () => {
      jest.spyOn(hashjs, 'sha256').mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hashedPassphrase'),
        }),
      })

      const error = new Error('Invalid Passphrase')
      authStorageMocks.set.mockRejectedValue(error)
      await actions.authAdd('name2', 'PrivatKey2', 'something')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })
  })

  describe('authUpdate', () => {
    let newNickname = 'new name 1'
    let newAuths: Auth[] = []
    const badOriginalNickname = 'name3'
    beforeEach(() => {
      getState.mockReturnValue({
        auths: {
          data: [auth1, auth2],
        },
      })
      newNickname = 'new name 1'
      newAuths = [
        {
          ...auth1,
          nickname: newNickname,
        },
        auth2,
      ]
    })

    it('starts auth update', async () => {
      await actions.authUpdate('name1', newNickname)(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.start())
    })

    it('succeeds with updated auth if auth found', async () => {
      await actions.authUpdate(auth1.nickname, newNickname)(dispatch, getState)

      expect(authStorageMocks.set).toHaveBeenCalledWith(newAuths)

      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success(newAuths))
    })

    it('dispatches error on storage error (when the essentially impossible scenario of no auths arrives)', async () => {
      getState.mockReturnValue({
        auths: {},
      })
      const error = new Error(`Key with name '${badOriginalNickname}' not found.`)
      authStorageMocks.set.mockRejectedValue(error)
      await actions.authUpdate(badOriginalNickname, 'any new name 1')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })

    it('dispatches error on storage error', async () => {
      const error = new Error(`Key with name '${badOriginalNickname}' not found.`)
      authStorageMocks.set.mockRejectedValue(error)
      await actions.authUpdate(badOriginalNickname, 'any new name 1')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })
  })

  describe('authRemove', () => {
    beforeEach(() => {
      getState.mockReturnValue({
        auths: {
          data: [auth1, auth2],
        },
      })
    })

    it('starts auth remove', async () => {
      await actions.authRemove('publicKey')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.start())
    })

    it('succeeds with removed auth if auth found', async () => {
      await actions.authRemove('publicKey1')(dispatch, getState)

      expect(authStorageMocks.set).toHaveBeenCalledWith([
        auth2,
      ])

      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success([
        auth2,
      ]))
    })

    it('succeeds with no removed auth if auth not found', async () => {
      await actions.authRemove('name3')(dispatch, getState)

      expect(authStorageMocks.set).not.toHaveBeenCalled()

      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.success([
        auth1,
        auth2,
      ]))
    })

    it('dispatches error on storage error', async () => {
      const error = new Error()
      authStorageMocks.set.mockRejectedValue(error)
      await actions.authRemove('publicKey1')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authsModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.authsModifyAsync.success())
    })
  })

  describe('authDelayedRemove', () => {
    let authRemoveSpy: jest.SpyInstance
    let authRemovingSpy: jest.SpyInstance

    beforeEach(() => {
      authRemoveSpy = jest.spyOn(actions, 'authRemove')
      authRemovingSpy = jest.spyOn(actions, 'authMarkForRemoval')

      getState.mockReturnValue({
        auths: {
          data: [auth1, auth2],
        },
      })
    })

    afterEach(() => {
      // Clears up timeouts
      actions.authDelayedRemoveUndo('publicKey1')(dispatch)
      actions.authDelayedRemoveUndo('publicKey2')(dispatch)
    })

    it('dispatches authsRemoving action', async () => {
      await actions.authDelayedRemove('publicKey1')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.authMarkForRemoval('publicKey1', true))
    })

    it('dispatches authRemove action after a timeout', async () => {
      auth1.removing = true
      await actions.authDelayedRemove('publicKey1')(dispatch, getState)
      expect(authRemoveSpy).toHaveBeenCalledWith('publicKey1')
    })

    describe('if the auth is already marked for removal', () => {
      beforeEach(async () => {
        await actions.authDelayedRemove('publicKey3')(dispatch, getState)
      })

      it('does not set timeout to remove twice', async () => {
        await actions.authDelayedRemove('publicKey3')(dispatch, getState)

        expect(authRemovingSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('authDelayedRemoveUndo', () => {
    beforeEach(() => {
      getState.mockReturnValue({
        auths: {
          data: [auth1, auth2],
        },
      })
    })

    it('dispatches authsRemoving action', async () => {
      await actions.authDelayedRemoveUndo('publicKey1')(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.authMarkForRemoval('publicKey1', false))
    })

    it('stops timeout to undo the removal', async () => {
      await actions.authDelayedRemove('publicKey')(dispatch, getState)
      expect(setTimeout).toHaveBeenCalledTimes(1)

      await actions.authDelayedRemoveUndo('publicKey')(dispatch)
      expect(clearTimeout).toHaveBeenCalledWith('timeoutId')
    })
  })
})
