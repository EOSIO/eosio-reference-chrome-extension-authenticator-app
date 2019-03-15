import 'utils/__mocks__/encrypter.mock'
import 'utils/storage/__mocks__/AuthStorage.mock'

import authsReducer from 'store/auths/authsReducer'
import * as Actions from 'store/auths/authsActions'
import AppState from 'store/AppState'

describe('Auths Reducer', () => {
  it('sets initial data', () => {
    const initialData = authsReducer(undefined, { type: null })

    expect(initialData).toEqual({
      data: [],
      loading: false,
      error: undefined,
    })
  })

  describe('action: modify', () => {
    describe('start', () => {
      it('sets loading', () => {
        const state: AppState['auths'] = {
          loading: false,
          error: undefined as Error,
        }
        const result = authsReducer(state, { type: Actions.AUTHS_MODIFY.START })

        expect(result).toEqual({
          loading: true,
          error: undefined,
        })
      })
    })

    describe('success', () => {
      it('sets auths', () => {
        const state: AppState['auths'] = {
          loading: true,
          error: undefined as Error,
        }
        const auths = [{}]

        const result = authsReducer(state, { type: Actions.AUTHS_MODIFY.SUCCESS, auths })

        expect(result).toEqual({
          data: auths,
          loading: false,
          error: undefined,
        })
      })
    })

    describe('error', () => {
      it('sets error', () => {
        const state: AppState['auths'] = {
          loading: true,
          error: undefined as Error,
        }
        const error = new Error()

        const result = authsReducer(state, { type: Actions.AUTHS_MODIFY.ERROR, error })

        expect(result).toEqual({
          loading: false,
          error,
        })
      })
    })
  })

  describe('action: removing', () => {
    it('sets removing on auth', () => {
      const state: AppState['auths'] = {
        loading: false,
        error: undefined as Error,
        data: [{
          nickname: 'nickname',
          publicKey: 'publicKey',
          encryptedPrivateKey: 'encryptedPrivateKey',
        }],
      }
      const result = authsReducer(state, Actions.authMarkForRemoval('publicKey', true))

      expect(result).toEqual({
        loading: false,
        error: undefined,
        data: [{
          nickname: 'nickname',
          publicKey: 'publicKey',
          encryptedPrivateKey: 'encryptedPrivateKey',
          removing: true,
        }],
      })
    })

    it('does not set removing if auth not found', () => {
      const state: AppState['auths'] = {
        loading: false,
        error: undefined as Error,
        data: [{
          nickname: 'nickname',
          publicKey: 'publicKey',
          encryptedPrivateKey: 'encryptedPrivateKey',
        }],
      }
      const result = authsReducer(state, Actions.authMarkForRemoval('publicKey2', true))

      expect(result).toEqual({
        loading: false,
        error: undefined,
        data: [{
          nickname: 'nickname',
          publicKey: 'publicKey',
          encryptedPrivateKey: 'encryptedPrivateKey',
        }],
      })
    })
  })
})
