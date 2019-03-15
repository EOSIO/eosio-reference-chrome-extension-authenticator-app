import '__mocks__/chrome.mock'

import * as DappInfoStorage from 'utils/storage/DappInfoStorage'

export const getDappInfo = jest.fn()
export const setDappInfo = jest.fn()
export const clear = jest.fn()

const DappInfoStorageMock = jest.spyOn(DappInfoStorage, 'default').mockImplementation(() => ({
  getDappInfo,
  setDappInfo,
  clear,
}))

export default DappInfoStorageMock
