import 'utils/storage/__mocks__/RequestStorage.mock'

import requestReducer from 'store/request/requestReducer'
import * as Actions from 'store/request/requestActions'

describe('Request Reducer', () => {
  it('sets initial data', () => {
    const initialData = requestReducer(undefined, { type: null })

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
        const result = requestReducer(state, { type: Actions.REQUEST_MODIFY.START })

        expect(result).toEqual({
          loading: true,
          error: undefined,
        })
      })
    })

    describe('success', () => {
      it('sets request', () => {
        const state = {
          loading: true,
          error: undefined as Error,
        }
        const request = {
          test: 'test',
        }

        const result = requestReducer(state, { type: Actions.REQUEST_MODIFY.SUCCESS, request })

        expect(result).toEqual({
          data: request,
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

        const result = requestReducer(state, { type: Actions.REQUEST_MODIFY.ERROR, error })

        expect(result).toEqual({
          loading: false,
          error,
        })
      })
    })
  })
})
