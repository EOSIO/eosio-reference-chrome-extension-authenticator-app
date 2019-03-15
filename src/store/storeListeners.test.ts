import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'
import * as authsListenersMock from 'store/auths/__mocks__/authsListeners.mock'
import * as insecureModeListenersMock from 'store/insecureMode/__mocks__/insecureModeListeners.mock'
import * as passphraseListenersMock from 'store/passphrase/__mocks__/passphraseListeners.mock'

import { getStoreListeners, startStoreListeners, stopStoreListeners } from 'store/storeListeners'

describe('storeListeners', () => {
  it('has four store listeners', () => {
    expect(getStoreListeners()).toHaveLength(4)
  })

  describe('startStoreListeners', () => {

    beforeEach(() => {
      startStoreListeners()
    })

    it('starts the auths listener', () => {
      expect(authsListenersMock.start).toHaveBeenCalled()
    })

    it('starts the insecure mode listener', () => {
      expect(insecureModeListenersMock.start).toHaveBeenCalled()
    })

    it('starts passphrase listener', () => {
      expect(passphraseListenersMock.start).toHaveBeenCalled()
    })
  })

  describe('stopStoreListeners', () => {
    beforeEach(() => {
      stopStoreListeners()
    })

    it('stops the auths listener', () => {
      expect(authsListenersMock.stop).toHaveBeenCalled()
    })

    it('stops the insecure mode listener', () => {
      expect(insecureModeListenersMock.stop).toHaveBeenCalled()
    })

    it('stops the passphrase listener', () => {
      expect(passphraseListenersMock.stop).toHaveBeenCalled()
    })
  })
})
