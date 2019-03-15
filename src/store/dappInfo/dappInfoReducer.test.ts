import 'utils/storage/__mocks__/DappInfoStorage.mock'

import dappInfoReducer from 'store/dappInfo/dappInfoReducer'
import * as Actions from 'store/dappInfo/dappInfoActions'

describe('Dapp Info Reducer', () => {
  it('sets initial data', () => {
    const initialData = dappInfoReducer(undefined, { type: null })

    expect(initialData).toEqual({
      data: null,
      loading: false,
      error: undefined,
    })
  })

  describe('action: modify', () => {
    describe('start', () => {
      it('sets loading', () => {
        const state = {
          loading: false,
          error: undefined as Error,
        }
        const result = dappInfoReducer(state, { type: Actions.DAPP_INFO_MODIFY.START })

        expect(result).toEqual({
          loading: true,
          error: undefined,
        })
      })
    })

    describe('success', () => {
      it('sets dapp info', () => {
        const state = {
          loading: true,
          error: undefined as Error,
        }
        const dappInfo = {}

        const result = dappInfoReducer(state, { type: Actions.DAPP_INFO_MODIFY.SUCCESS, dappInfo })

        expect(result).toEqual({
          data: dappInfo,
          loading: false,
          error: undefined,
        })
      })
    })

    describe('error', () => {
      it('sets error', () => {
        const state = {
          loading: true,
          error: undefined as Error,
        }
        const error = new Error()

        const result = dappInfoReducer(state, { type: Actions.DAPP_INFO_MODIFY.ERROR, error })

        expect(result).toEqual({
          loading: false,
          error,
        })
      })
    })
  })
})
