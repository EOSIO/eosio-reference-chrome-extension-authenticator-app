import * as workerMessagingMocks from 'workers/utils/__mocks__/workerMessaging.mock'
import encryptWorkerMock from 'workers/__mocks__/EncryptWorker.mock'
import decryptWorkerMock from 'workers/__mocks__/DecryptWorker.mock'
import reEncryptWorkerMock from 'workers/__mocks__/ReEncryptWorker.mock'

import * as encrypter from 'utils/encrypter'
import Auth from './Auth'

describe('encrypter', () => {
  describe('encrypt', () => {
    let encryptedValue: string

    beforeEach(async () => {
      workerMessagingMocks.postMessage.mockReturnValue('result')
      encryptedValue = await encrypter.encrypt('decryptedValue', 'passphrase')
    })

    it('posts an encrypt message to EncryptWorker', () => {
      expect(workerMessagingMocks.postMessage).toHaveBeenCalledWith(encryptWorkerMock, {
        decryptedValue: 'decryptedValue',
        passphrase: 'passphrase',
      })
    })

    it('returns the postMessage value', () => {
      expect(encryptedValue).toEqual('result')
    })
  })

  describe('decrypt', () => {
    let decryptedValue: string

    beforeEach(async () => {
      workerMessagingMocks.postMessage.mockReturnValue('result')
      decryptedValue = await encrypter.decrypt('encryptedValue', 'passphrase')
    })

    it('posts a decrypt message to DecryptWorker', () => {
      expect(workerMessagingMocks.postMessage).toHaveBeenCalledWith(decryptWorkerMock, {
        encryptedValue: 'encryptedValue',
        passphrase: 'passphrase',
      })
    })

    it('returns the postMessage value', () => {
      expect(decryptedValue).toEqual('result')
    })
  })

  describe('reEncryptAuths', () => {
    let auths: Auth[]
    let newAuths: Auth[]

    beforeEach(async () => {
      auths = [{
        nickname: 'nickname',
        publicKey: 'publicKey',
        encryptedPrivateKey: 'encryptedPrivateKey',
      }]

      workerMessagingMocks.postMessage.mockReturnValue([{
        nickname: 'nickname',
        publicKey: 'publicKey',
        encryptedPrivateKey: 'reEncryptedPrivateKey',
      }])
      newAuths = await encrypter.reEncryptAuths(auths, 'currentPassphrase', 'newPassphrase')
    })

    it('posts a re-encrypt auths message to ReEncryptWorker', () => {
      expect(workerMessagingMocks.postMessage).toHaveBeenCalledWith(reEncryptWorkerMock, {
        auths,
        currentPassphrase: 'currentPassphrase',
        newPassphrase: 'newPassphrase',
      })
    })

    it('returns the postMessage value', () => {
      expect(newAuths).toEqual([{
        nickname: 'nickname',
        publicKey: 'publicKey',
        encryptedPrivateKey: 'reEncryptedPrivateKey',
      }])
    })
  })
})
