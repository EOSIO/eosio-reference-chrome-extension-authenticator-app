import '__mocks__/chrome.mock'
import * as storeMocks from 'store/__mocks__/store.mock'

import InsecureModeListeners from 'store/insecureMode/insecureModeListeners'
import { insecureModeModifyAsync } from 'store/insecureMode/insecureModeActions'

describe('insecureModeListeners', () => {
  let listener: InsecureModeListeners

  beforeEach(() => {
    listener = new InsecureModeListeners()

    storeMocks.getState.mockReturnValue({
      insecureMode: {
        data: {
          enabled: true,
          whitelist: [],
        },
      },
    })

    listener.start()
  })

  afterEach(() => {
    listener.stop()
  })

  it('updates the insecure mode on callback', () => {
    listener.onChangeCallback({
      whitelist: ['whitelist'],
    })

    expect(storeMocks.dispatch).toHaveBeenCalledWith(insecureModeModifyAsync.success({
      enabled: true,
      whitelist: ['whitelist'],
    }))
  })
})
