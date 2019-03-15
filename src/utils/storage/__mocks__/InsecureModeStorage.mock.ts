import '__mocks__/chrome.mock'
import * as InsecureModeStorage from 'utils/storage/InsecureModeStorage'

export const get = jest.fn()
export const set = jest.fn()
export const addListener = jest.fn()
export const removeListener = jest.fn()
export const hasListener = jest.fn()

jest.spyOn(InsecureModeStorage, 'default').mockImplementation(() => ({
  get,
  set,
  addListener,
  removeListener,
  hasListener,
}))
