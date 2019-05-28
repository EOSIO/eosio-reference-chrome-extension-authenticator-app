import '__mocks__/chrome.mock'
import * as data from '__mocks__/data.mock'

import * as spi from 'eosjs-signature-provider-interface'

import * as WindowMessengerImport from 'content/WindowMessenger'
import { packEnvelope, ErrorCodes } from 'eosjs-signature-provider-interface'
import { createErrorResponseEnvelope } from 'utils/requests/signatureProviderEnvelopeGenerators'

describe('windowMessenger', () => {
  let windowMessenger: WindowMessengerImport.WindowMessenger
  let port: any
  let portMessageCallback: any
  let windowMessageCallback: any
  let portDisconnectCallback: any
  let portPostMessage: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    portPostMessage = jest.fn()
    port = {
      onMessage: {
        addListener: jest.fn((callback: any) => {
          portMessageCallback = callback
        }),
      },
      onDisconnect: {
        addListener: jest.fn((callback: any) => {
          portDisconnectCallback = callback
        }),
      },
      disconnect: portDisconnectCallback,
      postMessage: portPostMessage,
    }

    window.addEventListener = jest.fn((action: string, callback: any) => {
      windowMessageCallback = callback
    })
    window.postMessage = jest.fn()
    window.location = { href: 'http://domain.com' } as Location

    windowMessenger = new WindowMessengerImport.WindowMessenger(port)
    windowMessenger.setUpMessageListeners()
  })

  describe('setting up', () => {
    it('should add a listener to the chrome port', () => {
      expect(port.onMessage.addListener).toHaveBeenCalled()
    })

    it('should add a listener to the window object', () => {
      expect(window.addEventListener).toHaveBeenCalled()
    })

    it('should add an onDisconnect listener to the chrome port', () => {
      expect(port.onDisconnect.addListener).toHaveBeenCalled()
    })
  })

  describe('when a chrome port message is received', () => {
    describe('after a corrosponding request has been received', () => {
      beforeEach(() => {
        windowMessageCallback({
          data: spi.packEnvelope(data.transactionSignatureRequest),
          origin: window.location.href
        })
      })

      it('should not send a response if it is not a response envelope', () => {
        portMessageCallback({ notAResponse: 'not a response' })

        expect(window.postMessage).not.toHaveBeenCalled()
      })

      it('should post the message to the window on the declared domain', () => {
        portMessageCallback(data.transactionSignatureResponse)

        expect(window.postMessage)
          .toHaveBeenCalledWith(packEnvelope(data.transactionSignatureResponse), 'http://domain.one')
      })
    })

    describe('when a corrosponding request has not been received', () => {
      it('should post an error message to the window on wildcard target origin', () => {
        portMessageCallback(data.transactionSignatureResponse)

        const errorEnvelope = createErrorResponseEnvelope(data.transactionSignatureResponse, {
          reason: 'Could not securely send response to declared domain.',
          errorCode: ErrorCodes.vaultError,
          contextualInfo: '',
        })

        expect(window.postMessage).toHaveBeenCalledWith(packEnvelope(errorEnvelope), '*')
      })
    })
  })

  describe('when a window message is received', () => {
    it('should post to the chrome port if it is a valid request envelope', () => {
      windowMessageCallback({ data: spi.packEnvelope(data.transactionSignatureRequest), origin: window.location.href })

      expect(port.postMessage).toHaveBeenCalledWith(data.transactionSignatureRequest)
    })

    it('should not post to the chrome port if the message origin is not the current window', () => {
      windowMessageCallback({ data: spi.packEnvelope(data.transactionSignatureRequest), origin: 'http://example.one' })

      expect(port.postMessage).not.toHaveBeenCalled()
    })

    it('should unpack the message', () => {
      const unpackSpy = jest.spyOn(spi, 'unpackEnvelope')
      windowMessageCallback({ data: spi.packEnvelope(data.transactionSignatureRequest), origin: window.location.href })

      expect(unpackSpy).toHaveBeenCalled()
    })

    it('should not post to the chrome port if it can not unpack the message', () => {
      windowMessageCallback({ data: 'this is not hex code [];\',./<>?', origin: window.location.href })

      expect(port.postMessage).not.toHaveBeenCalled()
    })

    it('should not post to the chrome port if it is not a request envelope', () => {
      windowMessageCallback({
        data: spi.packEnvelope({ notARequest: 'not a request' } as any),
        origin: window.location.href
      })

      expect(port.postMessage).not.toHaveBeenCalled()
    })

    it('should send an error response if there is no port', () => {
      portDisconnectCallback()
      windowMessageCallback({ data: spi.packEnvelope(data.transactionSignatureRequest), origin: window.location.href })

      const errorEnvelope = createErrorResponseEnvelope(data.transactionSignatureResponse, {
        reason: 'Could not communicate with the vault.',
        errorCode: ErrorCodes.vaultError,
        contextualInfo: '',
      })

      expect(window.postMessage).toHaveBeenCalledWith(packEnvelope(errorEnvelope), 'http://domain.one')
    })
  })

  describe('when a chrome port is disconnected', () => {
    it('should not post a message to the chrome port', () => {
      portDisconnectCallback()
      windowMessageCallback({ data: spi.packEnvelope(data.transactionSignatureRequest), origin: window.location.href })

      expect(portPostMessage).not.toHaveBeenCalled()
    })
  })

  describe('singleton', () => {
    const getDefaultWindowMessenger = WindowMessengerImport.default
    let WindowMessenger: jest.Mock
    beforeEach(() => {
      WindowMessenger = jest.fn()
      jest.spyOn(WindowMessengerImport, 'WindowMessenger').mockImplementation(WindowMessenger)
    })

    it('uses the same instance for multiple calls', () => {
      const windowMessenger1 = getDefaultWindowMessenger()
      const windowMessenger2 = getDefaultWindowMessenger()
      expect(windowMessenger1).toBe(windowMessenger2)
    })
  })
})
