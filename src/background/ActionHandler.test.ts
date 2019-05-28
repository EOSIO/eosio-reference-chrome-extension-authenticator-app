import '__mocks__/chrome.mock'
import * as apiMocks from 'utils/__mocks__/Api.mock'
import * as requestStorageMocks from 'utils/storage/__mocks__/RequestStorage.mock'
import * as dappInfoStorageMocks from 'utils/storage/__mocks__/DappInfoStorage.mock'
import * as windowManagerMocks from 'utils/__mocks__/WindowManager.mock'
import * as manifestValidatorMocks from 'utils/manifest/__mocks__/ManifestValidator.mock'
import * as sameOriginValidatorMocks from 'utils/sameOrigin/__mocks__/SameOriginValidator.mock'
import * as manifestProviderMocks from 'utils/manifest/__mocks__/ManifestProvider.mock'
import * as payloadData from '__mocks__/data.mock'

import * as SPI from 'eosjs-signature-provider-interface'

import ActionHandler, { ERROR_MESSAGES } from 'background/ActionHandler'
import * as envelopeGenerators from 'utils/requests/signatureProviderEnvelopeGenerators'

describe('Action Handler', () => {
  let actionHandler: ActionHandler
  let port: any
  let manifestProvider: any
  let dappInfo: any

  beforeEach(() => {
    jest.clearAllMocks()
    windowManagerMocks.dappHasWindowOpen.mockReset()
    windowManagerMocks.createExtensionWindow.mockReset()

    dappInfo = 'dappInfo'

    port = {
      postMessage: jest.fn(),
      sender: {
        url: 'https://domain.one',
        tab: {
          id: 1,
        },
      },
    }

    manifestProvider = manifestProviderMocks.manifestProviderMock

    apiMocks.deserialize.mockReturnValue(payloadData.transactionWithSingleAction)

    manifestProviderMocks.getDappInfo.mockReturnValue(dappInfo)

    manifestValidatorMocks.validateAppMetadata.mockResolvedValue(null)
    manifestValidatorMocks.validateAppManifest.mockResolvedValue(null)
    manifestValidatorMocks.validateTransaction.mockResolvedValue(null)
    manifestValidatorMocks.transactionWithAssertAction.mockResolvedValue(null)

    sameOriginValidatorMocks.validateSameOriginPolicy.mockResolvedValue(null)

    jest.spyOn(envelopeGenerators, 'createErrorResponseEnvelope').mockReturnValue('errorResponse')

    actionHandler = new ActionHandler()
  })

  describe('any request', () => {
    let requestEnvelope: SPI.SignatureProviderRequestEnvelope

    beforeEach(() => {
      requestEnvelope = {
        id: 'requestId',
        request: {
          anyRequest: 'any request',
        },
      } as any

      jest.spyOn(SPI, 'envelopeDataType').mockReturnValue('anyRequest')
    })

    afterEach(() => {
      jest.spyOn(SPI, 'envelopeDataType').mockRestore()
    })

    it('validates app metadata', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(manifestValidatorMocks.validateAppMetadata).toHaveBeenCalled()
    })

    describe('if app metadata is valid', () => {
      it('sets the dapp info in dapp info storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(dappInfoStorageMocks.setDappInfo).toHaveBeenCalledWith(dappInfo)
      })
    })

    describe('if app metadata is not valid', () => {
      beforeEach(() => {
        manifestValidatorMocks.validateAppMetadata.mockRejectedValue(new Error('error'))
      })

      it('sends an error response', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(port.postMessage).toHaveBeenCalledWith('errorResponse')
      })

      it('does not set the action in request storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).not.toHaveBeenCalled()
      })

      it('does not set the dapp info in dapp info storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(dappInfoStorageMocks.setDappInfo).not.toHaveBeenCalled()
      })

      it('clears the storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.clear).toHaveBeenCalled()
        expect(dappInfoStorageMocks.clear).toHaveBeenCalled()
      })
    })

    it('validates same origin policy', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(sameOriginValidatorMocks.validateSameOriginPolicy)
        .toHaveBeenCalledWith(requestEnvelope, 'https://domain.one')
    })

    describe('if same origin policy check fails', () => {
      beforeEach(() => {
        sameOriginValidatorMocks.validateSameOriginPolicy.mockRejectedValue(new Error('The error'))
      })

      it('does not send the dapp a response', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(port.postMessage).not.toHaveBeenCalled()
      })

      it('sets error in storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).toHaveBeenCalledWith({
          requestError: 'The error',
        })
      })

      it('creates an extension window', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(windowManagerMocks.createExtensionWindow).toHaveBeenCalledWith(1)
      })
    })

    describe('if unable to retrieve dapp info', () => {
      beforeEach(() => {
        manifestProviderMocks.getDappInfo.mockRejectedValue(new Error('The error'))
      })

      it('sends an error response', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(port.postMessage).toHaveBeenCalledWith('errorResponse')
      })
    })
  })

  describe('transactionSignature request', () => {
    const requestEnvelope = payloadData.transactionSignatureRequest

    beforeEach(() => {
      apiMocks.deserialize.mockReturnValue('unpackedTransaction')
      manifestValidatorMocks.transactionWithAssertAction.mockReturnValue({
        requestEnvelope: 'requestEnvelopeWithAssert',
        transactionInfo: 'transactionInfoWithAssert',
      })
    })

    it('validates the app manifest', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(manifestValidatorMocks.validateAppManifest).toHaveBeenCalledWith('chainId1')
    })

    it('validates the transaction', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(manifestValidatorMocks.validateTransaction).toHaveBeenCalledWith('unpackedTransaction', 'chainId1')
    })

    it('adds the assert action', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(manifestValidatorMocks.transactionWithAssertAction)
        .toHaveBeenCalledWith('unpackedTransaction', 'chainId1', requestEnvelope)
    })

    it('adds the assert action', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(manifestValidatorMocks.transactionWithAssertAction)
        .toHaveBeenCalledWith('unpackedTransaction', 'chainId1', requestEnvelope)
    })

    describe('if the app manifest and transaction are valid', () => {
      it('sets the payload in request storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).toHaveBeenCalledWith({
          requestEnvelope: 'requestEnvelopeWithAssert',
          transactionInfo: 'transactionInfoWithAssert',
        })
      })

      it('creates an extension window', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(windowManagerMocks.createExtensionWindow).toHaveBeenCalledWith(1)
      })
    })

    describe('if the app manifest is not valid', () => {
      beforeEach(() => {
        manifestValidatorMocks.validateAppManifest.mockRejectedValue(new Error('error'))
      })

      it('sends an error response', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(port.postMessage).toHaveBeenCalledWith('errorResponse')
      })

      it('does not set the payload in request storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).not.toHaveBeenCalledWith({
          payload: expect.anything(),
        })
      })

      it('does not create an extension window', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(windowManagerMocks.createExtensionWindow).not.toHaveBeenCalled()
      })

      it('clears the storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.clear).toHaveBeenCalled()
        expect(dappInfoStorageMocks.clear).toHaveBeenCalled()
      })
    })

    describe('if the transaction is not valid', () => {
      beforeEach(() => {
        manifestValidatorMocks.validateTransaction.mockRejectedValue(new Error('error'))
      })

      it('sends an error response', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(port.postMessage).toHaveBeenCalledWith('errorResponse')
      })

      it('does not set the payload in request storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).not.toHaveBeenCalledWith({
          payload: expect.anything(),
        })
      })

      it('does not create an extension window', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(windowManagerMocks.createExtensionWindow).not.toHaveBeenCalled()
      })

      it('clears the storage', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.clear).toHaveBeenCalled()
        expect(dappInfoStorageMocks.clear).toHaveBeenCalled()
      })
    })

    describe('if the dapp already has another window open', () => {
      beforeEach(() => {
        windowManagerMocks.dappHasWindowOpen.mockReturnValue(true)
      })

      it('sets the payload in request storage with the newRequest flag set to true', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).toHaveBeenCalledWith({
          requestEnvelope: 'requestEnvelopeWithAssert',
          transactionInfo: 'transactionInfoWithAssert',
          newRequest: true
        })
      })
    })
  })

  describe('installationCheck request', () => {
    const requestEnvelope = payloadData.installationCheckRequest as SPI.SignatureProviderRequestEnvelope

    it('sends a message back with the response', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(port.postMessage).toHaveBeenCalledWith(payloadData.installationCheckResponse)
    })
  })

  describe('selectiveDisclosure request', () => {
    const requestEnvelope = payloadData.selectiveDisclosureRequest

    it('sets the payload in request storage', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(requestStorageMocks.set).toHaveBeenCalledWith({ requestEnvelope })
    })

    it('creates an extension window', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(windowManagerMocks.createExtensionWindow).toHaveBeenCalledWith(1)
    })

    describe('if the dapp already has another window open', () => {
      beforeEach(() => {
        windowManagerMocks.dappHasWindowOpen.mockReturnValue(true)
      })

      it('sets the payload in request storage with the newRequest flag set to true', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).toHaveBeenCalledWith({
          requestEnvelope,
          newRequest: true
        })
      })
    })
  })

  describe('invalid request type', () => {
    const requestEnvelope: SPI.SignatureProviderRequestEnvelope = {
      version: 'version',
      id: 'requestId',
      request: {
        invalidType: {},
      },
    } as any

    it('sets an error in storage', async () => {
      await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

      expect(requestStorageMocks.set).toHaveBeenCalledWith({
        requestError: ERROR_MESSAGES.INVALID_REQUEST_TYPE,
      })
    })

    describe('if the dapp already has another window open', () => {
      beforeEach(() => {
        windowManagerMocks.dappHasWindowOpen.mockReturnValue(true)
      })

      it('sets the payload in request storage with the newRequest flag set to true', async () => {
        await actionHandler.handleAction({ requestEnvelope, port, manifestProvider })

        expect(requestStorageMocks.set).toHaveBeenCalledWith({
          requestError: ERROR_MESSAGES.INVALID_REQUEST_TYPE,
          newRequest: true
        })
      })
    })
  })
})
