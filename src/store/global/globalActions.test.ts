import * as authsActionMocks from 'store/auths/__mocks__/authsActions.mock'
import * as dappInfoActionMocks from 'store/dappInfo/__mocks__/dappInfoActions.mock'
import * as requestActionMocks from 'store/request/__mocks__/requestActions.mock'

import * as actions from 'store/global/globalActions'

describe('Global Actions', () => {
  let dispatch: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    dispatch = jest.fn()
  })

  describe('globalLoad', () => {
    it('starts global load', async () => {
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.globalModifyAsync.start())
    })

    it('fetches auths', async () => {
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(authsActionMocks.authsFetch())
    })

    it('fetches dapp info', async () => {
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(dappInfoActionMocks.dappInfoFetch())
    })

    it('fetches the request', async () => {
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(requestActionMocks.requestFetch())
    })

    it('dispatches success when there are no errors', async () => {
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.globalModifyAsync.success())
    })

    it('dispatches error on fetch auth error', async () => {
      const error = new Error()
      dispatch = jest.fn((action) => {
        if (action === authsActionMocks.authsFetch()) {
          throw error
        }
      })
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.globalModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.globalModifyAsync.success())
    })

    it('dispatches error on fetch dapp info error', async () => {
      const error = new Error()
      dispatch = jest.fn((action) => {
        if (action === dappInfoActionMocks.dappInfoFetch()) {
          throw error
        }
      })
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.globalModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.globalModifyAsync.success())
    })

    it('dispatches error on fetch request error', async () => {
      const error = new Error()
      dispatch = jest.fn((action) => {
        if (action === requestActionMocks.requestFetch()) {
          throw error
        }
      })
      await actions.globalLoad()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.globalModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.globalModifyAsync.success())
    })
  })
})
