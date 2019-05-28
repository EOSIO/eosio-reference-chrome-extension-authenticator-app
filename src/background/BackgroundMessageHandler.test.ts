import * as windowManagerMocks from 'utils/__mocks__/WindowManager.mock'
import * as actionHandlerMocks from 'background/__mocks__/ActionHandler.mock'
import * as manifestProviderMocks from 'utils/manifest/__mocks__/ManifestProvider.mock'

import {
  SignatureProviderRequestEnvelope,
  SignatureProviderResponseEnvelope,
} from 'eosjs-signature-provider-interface'

import BackgroundMessageHandler from './BackgroundMessageHandler'
import * as ManifestProviderImport from 'utils/manifest/ManifestProvider'

describe('BackgroundMessageHandler', () => {
  let port: any
  let requestEnvelope: SignatureProviderRequestEnvelope
  let responseEnvelope: SignatureProviderResponseEnvelope
  let backgroundMessageHandler: BackgroundMessageHandler

  beforeEach(() => {
    jest.clearAllMocks()

    port = {
      sender: {
        url: 'http://domain.one',
        tab: {
          id: 1,
        },
      },
      postMessage: jest.fn(),
    }

    requestEnvelope = {
      version: 'version',
      id: 'requestId',
      declaredDomain: 'http://domain.one',
      returnUrl: 'returnUrl',
      request: {},
    }

    responseEnvelope = {
      id: 'requestId',
      response: {},
    }

    backgroundMessageHandler = new BackgroundMessageHandler()
  })

  describe('on request from dapp', () => {
    it('handles the action', () => {
      backgroundMessageHandler.onRequest(port, requestEnvelope)

      expect(actionHandlerMocks.handleAction).toHaveBeenCalledWith({
        requestEnvelope,
        port,
        manifestProvider: manifestProviderMocks.manifestProviderMock,
      })
    })

    describe('manifest provider caching', () => {
      let manifestProviderSpy: jest.Mock

      beforeEach(() => {
        manifestProviderSpy = jest.spyOn(ManifestProviderImport, 'default').mockImplementation((declaredDomain) => ({
          declaredDomain,
        }))
      })

      it('gets the cached manifestProvider for the same port', async () => {
        const port2: any = {
          sender: {
            tab: {
              id: 2,
            },
          },
        }

        await backgroundMessageHandler.onRequest(port, requestEnvelope)
        await backgroundMessageHandler.onRequest(port, requestEnvelope)
        await backgroundMessageHandler.onRequest(port2, requestEnvelope)

        expect(manifestProviderSpy).toHaveBeenCalledTimes(2)
      })

      it('creates a new manifestProvider if the declaredDomain changed for a cached manifestProvider', async () => {
        const requestEnvelope2: any = {
          declaredDomain: 'http://domain.two',
        }

        await backgroundMessageHandler.onRequest(port, requestEnvelope)
        await backgroundMessageHandler.onRequest(port, requestEnvelope2)

        expect(manifestProviderSpy).toHaveBeenCalledTimes(2)
      })

      it('creates a new manifestProvider if the port was closed', async () => {
        await backgroundMessageHandler.onRequest(port, requestEnvelope)
        await backgroundMessageHandler.onPortDisconnect(port)
        await backgroundMessageHandler.onRequest(port, requestEnvelope)

        expect(manifestProviderSpy).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('on response to dapp', () => {
    describe('when there has been a request with the specified requestId', () => {
      beforeEach(async () => {
        await backgroundMessageHandler.onRequest(port, requestEnvelope)
      })

      describe('and the port has not disconnected', () => {
        it('forwards messages to the correct chrome port', async () => {
          await backgroundMessageHandler.onResponse(responseEnvelope)

          expect(port.postMessage).toHaveBeenCalledWith(responseEnvelope)
        })

        it('does not send multiple responses for the same request', async () => {
          await backgroundMessageHandler.onResponse(responseEnvelope)
          await backgroundMessageHandler.onResponse(responseEnvelope)

          expect(port.postMessage).toHaveBeenCalledTimes(1)
        })
      })

      describe('and the port has disconnected', () => {
        beforeEach(async () => {
          await backgroundMessageHandler.onPortDisconnect(port)
        })

        it('does not forward messages to a chrome port', async () => {
          await backgroundMessageHandler.onResponse(responseEnvelope)

          expect(port.postMessage).not.toHaveBeenCalledWith(responseEnvelope)
        })
      })
    })

    describe('when there has not been a request with the specified requestId', () => {
      it('does not forward messages to a chrome port', async () => {
        await backgroundMessageHandler.onResponse(responseEnvelope)

        expect(port.postMessage).not.toHaveBeenCalledWith(responseEnvelope)
      })
    })
  })

  describe('on browser action', () => {
    it('calls showExtensionWindow on browser action button', () => {
      backgroundMessageHandler.onBrowserAction()

      expect(windowManagerMocks.showExtensionWindow).toHaveBeenCalled()
    })
  })
})
