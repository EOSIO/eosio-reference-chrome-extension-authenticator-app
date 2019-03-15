import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'
import * as storeMocks from 'store/__mocks__/store.mock'

import AuthsListeners from 'store/auths/authsListeners'
import { authsModifyAsync } from 'store/auths/authsActions'

describe('authsListeners', () => {
  let listener: AuthsListeners

  beforeEach(() => {
    listener = new AuthsListeners()

    storeMocks.getState.mockReturnValue({
      auths: [],
    })

    listener.start()
  })

  afterEach(() => {
    listener.stop()
  })

  it('updates the auths on callback', () => {
    const auths = {
      auths: [{
        nickname: 'auth1',
        publicKey: 'public key for auth1',
        encryptedPrivateKey: 'encrypted private key for auth1',
      }, {
        nickname: 'auth2',
        publicKey: 'public key for auth2',
        encryptedPrivateKey: 'encrypted private key for auth2',
      }, {
        nickname: 'auth3',
        publicKey: 'public key for auth3',
        encryptedPrivateKey: 'encrypted private key for auth3',
      }],
    }

    listener.onChangeCallback(auths)

    expect(storeMocks.dispatch).toHaveBeenCalledWith(authsModifyAsync.success(auths.auths))
  })
})
