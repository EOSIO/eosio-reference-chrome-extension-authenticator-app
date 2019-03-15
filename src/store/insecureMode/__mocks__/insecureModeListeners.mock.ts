import * as InsecureModeListeners from 'store/insecureMode/insecureModeListeners'

export const start = jest.fn()
export const stop = jest.fn()

jest.spyOn(InsecureModeListeners, 'default').mockImplementation(() => ({
  start,
  stop,
}))
