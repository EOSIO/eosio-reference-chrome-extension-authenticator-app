import '__mocks__/chrome.mock'
import * as storageMocks from 'utils/storage/__mocks__/Storage.mock'

import InsecureModeStorage from 'utils/storage/InsecureModeStorage'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'
import { StorageAreaName } from 'utils/storage/Storage'

const STORAGE_KEYS = ['enabled', 'whitelist']

describe('InsecureModeStorage', () => {
  let insecureModeStorage: InsecureModeStorage
  let insecureMode: InsecureMode

  beforeEach(async () => {
    insecureMode = {
      enabled: false,
      whitelist: [
        'url1',
        'url2',
      ],
    }

    storageMocks.get.mockImplementation(async (keys: string[]) => {
      const containsCorrectKeys = STORAGE_KEYS.every((key) => keys.includes(key))

      if (containsCorrectKeys) {
        return insecureMode
      }
      return null
    })

    insecureModeStorage = new InsecureModeStorage()
  })

  it('is instantiated with chrome local storage', () => {
    expect(storageMocks.StorageMock).toHaveBeenCalledWith(StorageAreaName.local)
  })

  describe('get', () => {
    it('gets the request from storage', async () => {
      const result = await insecureModeStorage.get()
      expect(result).toBe(insecureMode)
    })
  })

  describe('set', () => {
    it('sets the request to storage', async () => {
      await insecureModeStorage.set({
        enabled: true,
      })
      expect(storageMocks.set).toBeCalledWith({
        enabled: true,
      })
    })
  })

  describe('addListener', () => {
    it('adds listener to storage', async () => {
      const listener = jest.fn()
      await insecureModeStorage.addListener(listener)
      expect(storageMocks.addListener).toHaveBeenCalledWith(listener, STORAGE_KEYS)
    })
  })

  describe('removeListener', () => {
    it('removes listener from storage', async () => {
      await insecureModeStorage.removeListener('callbackId')
      expect(storageMocks.removeListener).toHaveBeenCalledWith('callbackId')
    })
  })

  describe('hasListener', () => {
    it('checks if storage has listener', async () => {
      await insecureModeStorage.hasListener('callbackId')
      expect(storageMocks.hasListener).toHaveBeenCalledWith('callbackId')
    })
  })
})
