import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as redux from 'redux'
import thunk from 'redux-thunk'

import rootReducer from 'store/rootReducer'

describe('store', () => {
  let store: any

  beforeEach(() => {
    jest.spyOn(redux, 'createStore').mockReturnValue('this is the store')
    jest.spyOn(redux, 'applyMiddleware').mockReturnValue('applied middleware')

    store = require('./store').default
  })

  it('returns the created store', () => {
    expect(store).toEqual('this is the store')
  })

  it('applies the thunk middleware', () => {
    expect(redux.applyMiddleware).toHaveBeenCalledWith(thunk)
  })

  it('passes the rootReducer and middleware to the store', () => {
    expect(redux.createStore).toHaveBeenCalledWith(
      rootReducer,
      'applied middleware',
    )
  })
})
