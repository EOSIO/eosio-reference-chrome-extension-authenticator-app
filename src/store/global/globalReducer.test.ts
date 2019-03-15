import 'utils/storage/__mocks__/RequestStorage.mock'
import 'utils/storage/__mocks__/AuthStorage.mock'
import 'utils/storage/__mocks__/DappInfoStorage.mock'
import 'utils/__mocks__/encrypter.mock'

import globalReducer from 'store/global/globalReducer'
import * as Actions from 'store/global/globalActions'

describe('Global Reducer', () => {
  it('sets initial data', () => {
    const initialData = globalReducer(undefined, { type: null })

    expect(initialData).toEqual({
      loading: true,
      error: undefined,
    })
  })

  describe('action: load', () => {
    describe('start', () => {
      it('sets loading', () => {
        const state = {
          loading: false,
          error: undefined as Error,
        }
        const result = globalReducer(state, { type: Actions.GLOBAL_MODIFY.START })

        expect(result).toEqual({
          loading: true,
          error: undefined,
        })
      })
    })

    describe('success', () => {
      it('sets loading', () => {
        const state = {
          loading: true,
          error: undefined as Error,
        }
        const result = globalReducer(state, { type: Actions.GLOBAL_MODIFY.SUCCESS })

        expect(result).toEqual({
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

        const result = globalReducer(state, { type: Actions.GLOBAL_MODIFY.ERROR, error })

        expect(result).toEqual({
          loading: false,
          error,
        })
      })
    })
  })
})
