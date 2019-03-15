import chrome from '__mocks__/chrome.mock'
import * as data from '__mocks__/data.mock'

import * as DappMessengerImport from './DappMessenger'

declare var global: any

describe('DappMessenger', () => {
  let dappMessenger: DappMessengerImport.DappMessenger

  beforeEach(() => {
    global.chrome = chrome

    dappMessenger = new DappMessengerImport.DappMessenger()
  })

  afterEach(() => {
    jest.clearAllMocks()
    chrome.reset()
  })

  describe('sendMessage', () => {
    beforeEach(async () => {
      await dappMessenger.sendMessage(data.transactionSignatureResponse)
    })

    it('sends a message on the chrome runtime', () => {
      expect(chrome.runtime.sendMessage.calledWith(data.transactionSignatureResponse)).toBe(true)
    })

    it('doesn\'t send the same requestId twice', async () => {
      await dappMessenger.sendMessage(data.transactionSignatureResponse)

      expect(chrome.runtime.sendMessage.callCount).toBe(1)
    })
  })

  describe('singleton', () => {
    const getDefaultDappMessenger = DappMessengerImport.default
    let DappMessenger: jest.Mock
    beforeEach(() => {
      DappMessenger = jest.fn()
      jest.spyOn(DappMessengerImport, 'DappMessenger').mockImplementation(DappMessenger)
    })

    it('uses the same instance for multiple calls', () => {
      const dappMessenger1 = getDefaultDappMessenger()
      const dappMessenger2 = getDefaultDappMessenger()
      expect(dappMessenger1).toBe(dappMessenger2)
    })
  })
})
