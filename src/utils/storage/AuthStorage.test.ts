import '__mocks__/chrome.mock'
import * as storageMocks from 'utils/storage/__mocks__/Storage.mock'

import AuthStorage from './AuthStorage'
import Auth from 'utils/Auth'
import { StorageAreaName } from 'utils/storage/Storage'

const STORAGE_KEY = 'auths'

describe('AuthStorage', () => {
  let authStorage: AuthStorage
  let auths: Auth[]

  beforeEach(() => {
    auths = [
      { encryptedPrivateKey: 'encryptedPrivateKey', publicKey: 'publicKey', nickname: 'the auth' },
      { encryptedPrivateKey: 'encryptedPrivateKey2', publicKey: 'publicKey2', nickname: 'the auth 2' },
    ]

    storageMocks.get.mockImplementation(async (key: string) => {
      if (key === 'auths') {
        return {
          auths,
        }
      }
      return null
    })

    authStorage = new AuthStorage()
  })

  it('is instantiated with chrome sync storage', () => {
    expect(storageMocks.StorageMock).toHaveBeenCalledWith(StorageAreaName.sync)
  })

  describe('get', () => {
    it('gets auths from storage', async () => {
      const result = await authStorage.get()
      expect(result).toBe(auths)
    })

    it('returns empty array if auths is null', async () => {
      storageMocks.get.mockImplementation(async (key: string) => {
        return {}
      })

      const result = await authStorage.get()
      expect(result).toEqual([])
    })
  })

  describe('set', () => {
    it('set auths to storage', async () => {
      await authStorage.set([{
        encryptedPrivateKey: 'encryptedPrivateKey',
        publicKey: 'publicKey',
        nickname: 'name',
      }])
      expect(storageMocks.set).toHaveBeenCalledWith({
        auths: [{ encryptedPrivateKey: 'encryptedPrivateKey', publicKey: 'publicKey', nickname: 'name' }],
      })
    })

    it('returns empty array if auths is null', async () => {
      storageMocks.get.mockImplementation(async (key: string) => {
        return {}
      })

      const result = await authStorage.get()
      expect(result).toEqual([])
    })
  })

  describe('clear', () => {
    it('clears the auths from storage', async () => {
      await authStorage.clear()
      expect(storageMocks.remove).toBeCalledWith('auths')
    })
  })

  describe('addListener', () => {
    it('adds listener to storage', async () => {
      const listener = jest.fn()
      await authStorage.addListener(listener)
      expect(storageMocks.addListener).toHaveBeenCalledWith(listener, STORAGE_KEY)
    })
  })

  describe('removeListener', () => {
    it('removes listener from storage', async () => {
      await authStorage.removeListener('callbackId')
      expect(storageMocks.removeListener).toHaveBeenCalledWith('callbackId')
    })
  })

  describe('hasListener', () => {
    it('checks if storage has listener', async () => {
      await authStorage.hasListener('callbackId')
      expect(storageMocks.hasListener).toHaveBeenCalledWith('callbackId')
    })
  })
})
