import * as passphraseStorageMocks from 'utils/storage/__mocks__/PassphraseStorage.mock'
import * as authStorageMocks from 'utils/storage/__mocks__/AuthStorage.mock'
import * as encrypter from 'utils/__mocks__/encrypter.mock'

import * as hash from 'hash.js'

import * as actions from 'store/passphrase/passphraseActions'
import Auth from 'utils/Auth'

describe('PassphraseActions', () => {
  let dispatch: jest.Mock
  let passphraseHash: string
  let update: jest.Mock
  let digest: jest.Mock
  let error: Error

  beforeEach(() => {
    jest.clearAllMocks()

    passphraseHash =  'phrase'

    dispatch = jest.fn()
    error = new Error()

    digest = jest.fn().mockReturnValue('hashed passphrase')
    update = jest.fn().mockReturnValue({ digest })

    jest.spyOn(hash, 'sha256').mockImplementation(() => ({ update }))
    encrypter.decrypt.mockImplementation((key) => `decrypted ${key}`)
    encrypter.encrypt.mockImplementation((key) => `re-encrypted ${key}`)

    passphraseStorageMocks.get.mockReturnValue(passphraseHash)
    passphraseStorageMocks.set.mockReturnValue(null)

    authStorageMocks.get.mockReturnValue([{
      encryptedPrivateKey: 'key #1',
    }, {
      encryptedPrivateKey: 'key #2',
    }])
    authStorageMocks.set.mockReturnValue(null)
  })

  describe('passphraseFetch', () => {
    it('starts passphrase fetch', async () => {
      await actions.passphraseFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.start())
    })

    it('succeeds with fetched passphrase', async () => {
      await actions.passphraseFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.success(passphraseHash))
    })

    it('dispatches error on storage error', async () => {
      passphraseStorageMocks.get.mockRejectedValue(error)
      await actions.passphraseFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.passphraseModifyAsync.success(passphraseHash))
    })
  })

  describe('passphraseAdd', () => {
    describe('on success', () => {
      beforeEach(async () => {
        await actions.passphraseAdd('passphrase')(dispatch)
      })

      it('starts passphrase add', () => {
        expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.start())
      })

      it('hashes the passphrase', () => {
        expect(update).toHaveBeenCalledWith('passphrase')
      })

      it('sets the hash in storage', () => {
        expect(passphraseStorageMocks.set).toHaveBeenCalledWith(
          'hashed passphrase',
        )
      })

      it('dispatches the success action', () => {
        expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.success(
          'hashed passphrase',
        ))
      })
    })

    describe('on storage error', () => {
      beforeEach(async () => {
        passphraseStorageMocks.set.mockRejectedValue(error)
        await actions.passphraseAdd('passphrase')(dispatch)
      })

      it('dispatches the error action', () => {
        expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.error(error))
      })

      it('does not dispatch the success action', () => {
        expect(dispatch).not.toHaveBeenCalledWith(actions.passphraseModifyAsync.success())
      })
    })
  })

  describe('passphraseUpdate', () => {
    describe('on success', () => {
      let newAuths: Auth[]

      beforeEach(async () => {
        newAuths = [{
          nickname: 'nickname',
          publicKey: 'publicKey',
          encryptedPrivateKey: 'newEncryptedPrivateKey',
        }]

        encrypter.reEncryptAuths.mockReturnValue(newAuths)
        await actions.passphraseUpdate('oldPassphrase', 'newPassphrase')(dispatch)
      })

      it('starts passphrase add', () => {
        expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.start())
      })

      it('hashes the passphrase', () => {
        expect(update).toHaveBeenCalledWith('newPassphrase')
      })

      it('gets the auths from auth storage', () => {
        expect(authStorageMocks.get).toHaveBeenCalled()
      })

      it('re-encrypts the auths', () => {
        expect(encrypter.reEncryptAuths).toHaveBeenCalledWith([{
          encryptedPrivateKey: 'key #1',
        }, {
          encryptedPrivateKey: 'key #2',
        }], 'oldPassphrase', 'newPassphrase')
      })

      it('sets the newly encrypted keys in auth storage', () => {
        expect(authStorageMocks.set).toHaveBeenCalledWith(newAuths)
      })

      it('sets the hash in passphrase hash storage', () => {
        expect(passphraseStorageMocks.set).toHaveBeenCalledWith(
          'hashed passphrase',
        )
      })

      it('dispatches the success action', () => {
        expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.success(
          'hashed passphrase',
        ))
      })
    })

    describe('on storage error', () => {
      beforeEach(async () => {
        passphraseStorageMocks.set.mockRejectedValue(error)
        await actions.passphraseUpdate('oldPassphrase', 'newPassphrase')(dispatch)
      })

      it('dispatches the error action', () => {
        expect(dispatch).toHaveBeenCalledWith(actions.passphraseModifyAsync.error(error))
      })

      it('does not dispatch the success action', () => {
        expect(dispatch).not.toHaveBeenCalledWith(actions.passphraseModifyAsync.success())
      })
    })
  })
})
