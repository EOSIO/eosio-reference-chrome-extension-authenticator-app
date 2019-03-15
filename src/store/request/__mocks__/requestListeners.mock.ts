import * as RequestListeners from 'store/request/requestListeners'

export const start = jest.fn()
export const stop = jest.fn()

jest.spyOn(RequestListeners, 'default').mockImplementation(() => ({
  start,
  stop,
}))
