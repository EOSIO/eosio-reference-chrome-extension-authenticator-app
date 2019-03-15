import '__mocks__/chrome.mock'

import * as PassphraseStorage from 'utils/storage/PassphraseHashStorage'

export const get = jest.fn()
export const set = jest.fn()
export const addListener = jest.fn()
export const removeListener = jest.fn()
export const hasListener = jest.fn()

const PassphraseStorageMock = jest.spyOn(PassphraseStorage, 'default').mockImplementation(() => ({
  get,
  set,
  addListener,
  removeListener,
  hasListener,
}))

export default PassphraseStorageMock
