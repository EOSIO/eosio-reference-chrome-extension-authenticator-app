import '__mocks__/chrome.mock'

import * as RequestStorage from 'utils/storage/RequestStorage'

export const get = jest.fn()
export const set = jest.fn()
export const clear = jest.fn()
export const addListener = jest.fn()
export const removeListener = jest.fn()
export const hasListener = jest.fn()

const RequestStorageMock = jest.spyOn(RequestStorage, 'default').mockImplementation(() => ({
  get,
  set,
  clear,
  addListener,
  removeListener,
  hasListener,
}))

export default RequestStorageMock
