import '__mocks__/chrome.mock'
import 'store/auths/__mocks__/authsActions.mock'

import rootReducer from 'store/rootReducer'

describe('rootReducer', () => {
  it('combines the reducers', () => {
    const combinedReducers = rootReducer(undefined, {} as any)

    expect(Object.keys(combinedReducers)).toEqual([
      'auths',
      'dappInfo',
      'global',
      'insecureMode',
      'passphraseHash',
      'request',
    ])
  })
})
