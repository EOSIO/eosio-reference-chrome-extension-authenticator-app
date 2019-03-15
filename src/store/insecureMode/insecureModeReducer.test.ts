import 'utils/storage/__mocks__/InsecureModeStorage.mock'

import insecureModeReducer from 'store/insecureMode/insecureModeReducer'
import * as Actions from 'store/insecureMode/insecureModeActions'

describe('InsecureMode Reducer', () => {
  it('sets initial data', () => {
    const initialData = insecureModeReducer(undefined, { type: null })

    expect(initialData).toEqual({
      data: {
        enabled: false,
        whitelist: [],
      },
      loading: false,
      error: null,
    })
  })

  describe('action: modify', () => {
    describe('start', () => {
      it('sets loading', () => {
        const state = {
          loading: false,
          error: null as Error,
        }
        const result = insecureModeReducer(state, { type: Actions.INSECURE_MODE_MODIFY.START })

        expect(result).toEqual({
          loading: true,
          error: null,
        })
      })
    })

    describe('success', () => {
      it('sets insecureMode', () => {
        const state = {
          loading: true,
          error: null as Error,
        }
        const insecureMode = {
          enabled: false,
          whitelist: [] as string[],
        }

        const result = insecureModeReducer(state, { type: Actions.INSECURE_MODE_MODIFY.SUCCESS, insecureMode })

        expect(result).toEqual({
          data: insecureMode,
          loading: false,
          error: null,
        })
      })
    })

    describe('error', () => {
      describe('sets error', () => {
        const state = {
          loading: false,
          error: null as Error,
        }
        const error = new Error()

        const result = insecureModeReducer(state, { type: Actions.INSECURE_MODE_MODIFY.ERROR, error })

        expect(result).toEqual({
          loading: false,
          error,
        })
      })
    })
  })
})
