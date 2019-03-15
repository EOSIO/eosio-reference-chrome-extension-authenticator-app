import * as requestStorageMocks from 'utils/storage/__mocks__/RequestStorage.mock'
import * as data from '__mocks__/data.mock'

import * as actions from 'store/request/requestActions'
import DappRequest from 'utils/requests/DappRequest'

describe('Request Actions', () => {
  let dispatch: jest.Mock
  let getState: jest.Mock
  let request: DappRequest

  beforeEach(() => {
    jest.clearAllMocks()

    dispatch = jest.fn()
    getState = jest.fn(() => ({
      request: {},
    }))

    request = {
      requestEnvelope: data.transactionSignatureRequest,
      requestError: 'error',
    }
  })

  describe('requestFetch', () => {
    describe('if request has not been fetched from storage yet', () => {
      beforeEach(() => {
        requestStorageMocks.get.mockReturnValue(request)
      })

      it('starts request fetch', async () => {
        await actions.requestFetch()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith(actions.requestModifyAsync.start())
      })

      it('succeeds with fetched request', async () => {
        await actions.requestFetch()(dispatch, getState)
        expect(requestStorageMocks.clear).toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalledWith(actions.requestModifyAsync.success(request))
      })

      it('dispatches error on storage error', async () => {
        const error = new Error()
        requestStorageMocks.get.mockRejectedValue(error)
        await actions.requestFetch()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith(actions.requestModifyAsync.error(error))
        expect(dispatch).not.toHaveBeenCalledWith(actions.requestModifyAsync.success())
      })
    })

    describe('if the request has already been fetched from storage', () => {
      beforeEach(() => {
        requestStorageMocks.get.mockReturnValue({})
        getState.mockReturnValue({
          request: {
            data: request,
          },
        })
      })

      it('succeeds with cached auths', async () => {
        await actions.requestFetch()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith(actions.requestModifyAsync.success(request))
      })
    })
  })
})
