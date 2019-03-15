import 'utils/storage/__mocks__/InsecureModeStorage.mock'
import 'utils/__mocks__/encrypter.mock'

import passphraseReducer from 'store/passphrase/passphraseReducer'
import * as Actions from 'store/passphrase/passphraseActions'

describe('passphraseReducer', () => {
  it('sets initial data', () => {
    const initialData = passphraseReducer(undefined, { type: null })

    expect(initialData).toEqual({
      data: null,
      error: null,
      loading: false,
    })
  })

  describe('action: modify', () => {
    describe('start', () => {
      it('sets loading', () => {
        const state = {
          loading: false,
          error: null as Error,
        }
        const result = passphraseReducer(state, { type: Actions.PASSPHRASE_MODIFY.START })

        expect(result).toEqual({
          loading: true,
          error: null,
        })
      })
    })

    describe('success', () => {
      it('sets passphrase', () => {
        const state = {
          loading: true,
          error: null as Error,
        }
        const passphraseHash =  'phrase'

        const result = passphraseReducer(state, { type: Actions.PASSPHRASE_MODIFY.SUCCESS, passphraseHash })

        expect(result).toEqual({
          data: passphraseHash,
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

        const result = passphraseReducer(state, { type: Actions.PASSPHRASE_MODIFY.ERROR, error })

        expect(result).toEqual({
          loading: false,
          error,
        })
      })
    })
  })
})
