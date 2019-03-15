import '__mocks__/chrome.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'
import * as storageMocks from 'utils/storage/__mocks__/Storage.mock'

import DappInfoStorage from './DappInfoStorage'
import { DappInfo } from 'utils/manifest/DappInfo'
import { StorageAreaName } from 'utils/storage/Storage'

const STORAGE_KEY = 'dappInfo'

describe('DappInfoStorage', () => {
  let dappInfoStorage: DappInfoStorage
  let dappInfo: DappInfo

  beforeEach(() => {
    dappInfo = manifestData.dappInfo

    storageMocks.get.mockImplementation(async (key: string) => {
      if (key === 'dappInfo') {
        return {
          dappInfo,
        }
      }
      return null
    })

    dappInfoStorage = new DappInfoStorage()
  })

  it('is instantiated with chrome local storage', () => {
    expect(storageMocks.StorageMock).toHaveBeenCalledWith(StorageAreaName.local)
  })

  describe('getDappInfo', () => {
    it('gets the dappInfo from storage', async () => {
      const result = await dappInfoStorage.getDappInfo()
      expect(result).toBe(dappInfo)
    })
  })

  describe('setDappInfo', () => {
    it('sets the dappInfo to storage', async () => {
      await dappInfoStorage.setDappInfo(dappInfo)
      expect(storageMocks.set).toBeCalledWith({ dappInfo })
    })
  })

  describe('clear', () => {
    it('clears the dapp info from storage', async () => {
      await dappInfoStorage.clear()
      expect(storageMocks.remove).toBeCalledWith('dappInfo')
    })
  })

  describe('addListener', () => {
    it('adds listener to storage', async () => {
      const listener = jest.fn()
      await dappInfoStorage.addListener(listener)
      expect(storageMocks.addListener).toHaveBeenCalledWith(listener, STORAGE_KEY)
    })
  })

  describe('removeListener', () => {
    it('removes listener from storage', async () => {
      await dappInfoStorage.removeListener('callbackId')
      expect(storageMocks.removeListener).toHaveBeenCalledWith('callbackId')
    })
  })

  describe('hasListener', () => {
    it('checks if storage has listener', async () => {
      await dappInfoStorage.hasListener('callbackId')
      expect(storageMocks.hasListener).toHaveBeenCalledWith('callbackId')
    })
  })
})
