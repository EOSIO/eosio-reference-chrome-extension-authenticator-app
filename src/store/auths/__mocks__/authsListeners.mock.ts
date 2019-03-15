import * as AuthsListeners from 'store/auths/authsListeners'

export const start = jest.fn()
export const stop = jest.fn()

jest.spyOn(AuthsListeners, 'default').mockImplementation(() => ({
  start,
  stop,
}))
