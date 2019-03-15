import 'utils/__mocks__/encrypter.mock'

import * as redux from 'redux'

export const dispatch = jest.fn()
export const getState = jest.fn()

jest.spyOn(redux, 'createStore').mockReturnValue({
  dispatch,
  getState,
})
