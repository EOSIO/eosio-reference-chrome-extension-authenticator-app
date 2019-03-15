import '__mocks__/chrome.mock'
import * as data from '__mocks__/data.mock'
import * as storeMocks from 'store/__mocks__/store.mock'

import RequestListeners from 'store/request/requestListeners'
import { requestModifyAsync } from 'store/request/requestActions'

describe('requestListeners', () => {
  let listener: RequestListeners

  beforeEach(() => {
    listener = new RequestListeners()

    storeMocks.getState.mockReturnValue({
      request: {
        data: {
          requestEnvelope: data.selectiveDisclosureRequest,
        },
      },
    })

    listener.start()
  })

  afterEach(() => {
    listener.stop()
  })

  it('updates the passphrase hash on callback', () => {
    listener.onChangeCallback({
      requestEnvelope: data.transactionSignatureRequest,
      newRequest: true
    })

    expect(storeMocks.dispatch).toHaveBeenCalledWith(requestModifyAsync.success({
      requestEnvelope: data.selectiveDisclosureRequest,
      newRequest: true
    }))
  })
})
