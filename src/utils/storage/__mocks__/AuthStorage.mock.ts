import '__mocks__/chrome.mock'

import * as AuthStorage from 'utils/storage/AuthStorage'

export const get = jest.fn()
export const set = jest.fn()
export const clear = jest.fn()
export const addListener = jest.fn()
export const removeListener = jest.fn()
export const hasListener = jest.fn()

jest.spyOn(AuthStorage, 'default').mockImplementation(() => ({
  get,
  set,
  clear,
  addListener,
  removeListener,
  hasListener,
}))
