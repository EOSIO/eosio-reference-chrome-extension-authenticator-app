import * as dappInfoStorageMocks from 'utils/storage/__mocks__/DappInfoStorage.mock'

import * as actions from 'store/dappInfo/dappInfoActions'

describe('Dapp Info Actions', () => {
  let dispatch: jest.Mock
  let getState: jest.Mock
  let dappInfo: any

  beforeEach(() => {
    jest.clearAllMocks()

    dispatch = jest.fn()
    getState = jest.fn(() => ({
      dappInfo: {},
    }))

    dappInfo = {}
  })

  describe('dappInfoFetch', () => {
    describe('if dappInfo has not been fetched from storage yet', () => {
      beforeEach(() => {
        dappInfoStorageMocks.getDappInfo.mockReturnValue(dappInfo)
      })

      it('starts dappInfo fetch', async () => {
        await actions.dappInfoFetch()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith(actions.dappInfoModifyAsync.start())
      })

      it('succeeds with fetched auths', async () => {
        await actions.dappInfoFetch()(dispatch, getState)
        expect(dappInfoStorageMocks.clear).toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalledWith(actions.dappInfoModifyAsync.success(dappInfo))
      })

      it('dispatches error on storage error', async () => {
        const error = new Error()
        dappInfoStorageMocks.getDappInfo.mockRejectedValue(error)
        await actions.dappInfoFetch()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith(actions.dappInfoModifyAsync.error(error))
        expect(dispatch).not.toHaveBeenCalledWith(actions.dappInfoModifyAsync.success())
      })
    })

    describe('if the dappInfo has already been fetched from storage', () => {
      beforeEach(() => {
        dappInfoStorageMocks.getDappInfo.mockReturnValue({})
        getState.mockReturnValue({
          dappInfo: {
            data: dappInfo,
          },
        })
      })

      it('succeeds with cached auths', async () => {
        await actions.dappInfoFetch()(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith(actions.dappInfoModifyAsync.success(dappInfo))
      })
    })
  })
})
