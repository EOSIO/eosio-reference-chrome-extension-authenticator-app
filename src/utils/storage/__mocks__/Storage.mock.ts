import * as Storage from 'utils/storage/Storage'

export const get = jest.fn()
export const set = jest.fn()
export const remove = jest.fn()
export const clear = jest.fn()
export const merge = jest.fn()
export const addListener = jest.fn()
export const removeListener = jest.fn()
export const hasListener = jest.fn()

export const StorageMock: jest.Mock = jest.spyOn(Storage, 'default').mockImplementation(() => ({
  get,
  set,
  remove,
  clear,
  merge,
  addListener,
  removeListener,
  hasListener,
}))
