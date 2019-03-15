import '__mocks__/chrome.mock'
import * as storageMocks from 'utils/storage/__mocks__/Storage.mock'
import PassphraseStorage from 'utils/storage/PassphraseHashStorage'
import { StorageAreaName } from './Storage'

const STORAGE_KEYS = ['hash']

describe('PassphraseStorage', () => {
  let passphraseStorage: PassphraseStorage
  let passphrase: any

  beforeEach(async () => {
    passphrase = {
      hash:  'phrase',
    }

    storageMocks.get.mockImplementation(async (keys: string[]) => {
      const containsCorrectKeys = STORAGE_KEYS.every((key) => keys.includes(key))

      if (containsCorrectKeys) {
        return passphrase
      }
      return null
    })

    passphraseStorage = new PassphraseStorage()
  })

  it('is instantiated with chrome sync storage', () => {
    expect(storageMocks.StorageMock).toHaveBeenCalledWith(StorageAreaName.sync)
  })

  describe('get', () => {
    it('gets the request from storage', async () => {
      const result = await passphraseStorage.get()
      expect(result).toBe('phrase')
    })
  })

  describe('set', () => {
    it('sets the request to storage', async () => {
      await passphraseStorage.set('phrase1')
      expect(storageMocks.set).toBeCalledWith({ hash: 'phrase1' })
    })
  })

  describe('addListener', () => {
    it('adds listener to storage', async () => {
      const listener = jest.fn()
      await passphraseStorage.addListener(listener)
      expect(storageMocks.addListener).toHaveBeenCalledWith(listener, STORAGE_KEYS)
    })
  })

  describe('removeListener', () => {
    it('removes listener from storage', async () => {
      await passphraseStorage.removeListener('callbackId')
      expect(storageMocks.removeListener).toHaveBeenCalledWith('callbackId')
    })
  })

  describe('hasListener', () => {
    it('checks if storage has listener', async () => {
      await passphraseStorage.hasListener('callbackId')
      expect(storageMocks.hasListener).toHaveBeenCalledWith('callbackId')
    })
  })
})
