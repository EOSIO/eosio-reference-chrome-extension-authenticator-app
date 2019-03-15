import '__mocks__/chrome.mock'
import * as storeMocks from 'store/__mocks__/store.mock'

import PassphraseListeners from 'store/passphrase/passphraseListeners'
import { passphraseModifyAsync } from 'store/passphrase/passphraseActions'

describe('passphraseListeners', () => {
  let listener: PassphraseListeners

  beforeEach(() => {
    listener = new PassphraseListeners()

    storeMocks.getState.mockReturnValue({
      passphrase: {
        hash: 'some hashed passphrase',
      },
    })

    listener.start()
  })

  afterEach(() => {
    listener.stop()
  })

  it('updates the passphrase hash on callback', () => {
    listener.onChangeCallback({
      hash: 'a new hashed passphrase',
    })

    expect(storeMocks.dispatch).toHaveBeenCalledWith(passphraseModifyAsync.success(
      'a new hashed passphrase',
    ))
  })
})
