import '__mocks__/chrome.mock'
import * as data from '__mocks__/data.mock'
import * as storageMocks from 'utils/storage/__mocks__/Storage.mock'

import RequestStorage from './RequestStorage'
import DappRequest from 'utils/requests/DappRequest'
import { StorageAreaName } from 'utils/storage/Storage'

const STORAGE_KEYS = ['transactionInfo', 'requestEnvelope', 'requestError', 'newRequest']

describe('RequestStorage', () => {
  let requestStorage: RequestStorage
  let request: DappRequest

  beforeEach(() => {
    request = {
      transactionInfo: {
        actions: [],
      },
      requestEnvelope: data.transactionSignatureRequest,
      requestError: 'error',
    }

    storageMocks.get.mockImplementation(async (keys: string[]) => {
      const containsCorrectKeys = STORAGE_KEYS.every((key) => keys.includes(key))

      if (containsCorrectKeys) {
        return request
      }
      return null
    })

    requestStorage = new RequestStorage()
  })

  it('is instantiated with chrome local storage', () => {
    expect(storageMocks.StorageMock).toHaveBeenCalledWith(StorageAreaName.local)
  })

  describe('get', () => {
    it('gets the request from storage', async () => {
      const result = await requestStorage.get()
      expect(result).toBe(request)
    })
  })

  describe('set', () => {
    it('sets the request to storage', async () => {
      await requestStorage.set(request)
      expect(storageMocks.set).toBeCalledWith(request)
    })
  })

  describe('clear', () => {
    it('clears the request from storage', async () => {
      await requestStorage.clear()
      expect(storageMocks.remove).toBeCalledWith(STORAGE_KEYS)
    })
  })

  describe('addListener', () => {
    it('adds listener to storage', async () => {
      const listener = jest.fn()
      await requestStorage.addListener(listener)
      expect(storageMocks.addListener).toHaveBeenCalledWith(listener, STORAGE_KEYS)
    })
  })

  describe('removeListener', () => {
    it('removes listener from storage', async () => {
      await requestStorage.removeListener('callbackId')
      expect(storageMocks.removeListener).toHaveBeenCalledWith('callbackId')
    })
  })

  describe('hasListener', () => {
    it('checks if storage has listener', async () => {
      await requestStorage.hasListener('callbackId')
      expect(storageMocks.hasListener).toHaveBeenCalledWith('callbackId')
    })
  })
})
