import {
  SignatureProviderRequestEnvelope,
  ErrorCodes,
  envelopeDataType,
  EnvelopeDataType,
  instanceOfTransactionSignatureRequest,
} from 'eosjs-signature-provider-interface'

import Api from 'utils/Api'
import ManifestValidator from 'utils/manifest/ManifestValidator'
import ManifestProvider from 'utils/manifest/ManifestProvider'
import RequestStorage from 'utils/storage/RequestStorage'
import DappInfoStorage from 'utils/storage/DappInfoStorage'
import getDefaultWindowManager from 'utils/WindowManager'
import {
  createErrorResponseEnvelope,
  createInstallationCheckResponseEnvelope,
} from 'utils/requests/signatureProviderEnvelopeGenerators'
import {
  checkIfInstallationType,
  INSTALLATION_CHECK_ACTION,
} from 'utils/requests/installationCheckRequestHelpers'
import SameOriginValidator from 'utils/sameOrigin/SameOriginValidator'
import DappRequest from 'utils/requests/DappRequest'

interface ActionParams {
  requestEnvelope: SignatureProviderRequestEnvelope
  port: chrome.runtime.Port
  manifestProvider: ManifestProvider
}

interface HandleErrorResponseParams {
  port: chrome.runtime.Port
  requestEnvelope: SignatureProviderRequestEnvelope
  reason: string
  errorCode: ErrorCodes
  contextualInfo?: string
}

interface HandleInVaultErrorParams {
  port: chrome.runtime.Port
  error: string
}

export const ERROR_MESSAGES = {
  INVALID_REQUEST_TYPE: 'The request type is invalid.',
}

export default class ActionHandler {
  private requestStorage = new RequestStorage()
  private dappInfoStorage = new DappInfoStorage()
  private extensionWindowManager = getDefaultWindowManager()

  public async handleAction(params: ActionParams) {
    const { manifestProvider, requestEnvelope, port } = params
    const { securityExclusions } = requestEnvelope
    const senderUrl = port.sender.url

    // TODO: add checkInstallation to envelopeDataTypes
    let action = envelopeDataType(requestEnvelope) as any
    // TODO: remove once checkInstallation type is added
    action = action ? action : checkIfInstallationType(requestEnvelope)
    const chainId = this.getChainIdFromRequestEnvelope(requestEnvelope)

    let dappInfo
    try {
      dappInfo = await manifestProvider.getDappInfo(chainId)
    } catch (error) {
      return this.handleErrorResponse({
        port,
        reason: error.message,
        errorCode: ErrorCodes.resourceRetrievalError,
        requestEnvelope,
      })
    }
    const sameOriginValidator = new SameOriginValidator({ manifestProvider, securityExclusions })
    const manifestValidator = new ManifestValidator({ manifestProvider, securityExclusions })

    try {
      await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
    } catch (error) {
      return this.handleInVaultError({ port, error: error.message })
    }

    try {
      await manifestValidator.validateAppMetadata()
    } catch (error) {
      return this.handleErrorResponse({
        port,
        reason: error.message,
        errorCode: ErrorCodes.metadataError,
        requestEnvelope,
      })
    }

    await this.dappInfoStorage.setDappInfo(dappInfo)

    switch (action) {
    case EnvelopeDataType.TRANSACTION_SIGNATURE:
      return this.onTransactionSignatureRequest(params)
    case EnvelopeDataType.SELECTIVE_DISCLOSURE:
      return this.onSelectiveDisclosure(params)
      // TODO: replace with EnvelopeDataType.INSTALLATION_CHECK_ACTION
    case INSTALLATION_CHECK_ACTION:
      return this.onInstallationCheck(params)
    default:
      return this.handleInVaultError({ port, error: ERROR_MESSAGES.INVALID_REQUEST_TYPE })
    }
  }

  private async onInstallationCheck({ requestEnvelope, port }: ActionParams) {
    const { id } = requestEnvelope
    const responseEnvelope = createInstallationCheckResponseEnvelope(id)
    port.postMessage(responseEnvelope)
  }

  private async onTransactionSignatureRequest({ requestEnvelope, port, manifestProvider }: ActionParams) {
    const {
      securityExclusions,
      request: {
        transactionSignature: {
          abis,
          publicKeys,
          chainId,
          transaction,
        },
      },
    } = requestEnvelope
    const manifestValidator = new ManifestValidator({ manifestProvider, securityExclusions })

    try {
      await manifestValidator.validateAppManifest(chainId)
    } catch (error) {
      return this.handleErrorResponse({
        port,
        reason: error.message,
        errorCode: ErrorCodes.manifestError,
        requestEnvelope,
      })
    }

    const api = new Api(abis, publicKeys, chainId)
    const { packedTrx } = transaction
    const transactionInfo = await api.deserialize(packedTrx)

    try {
      await manifestValidator.validateTransaction(transactionInfo, chainId)
    } catch (error) {
      return this.handleErrorResponse({
        port,
        reason: error.message,
        errorCode: ErrorCodes.manifestError,
        requestEnvelope,
      })
    }

    const transactionBundle = await manifestValidator.transactionWithAssertAction(
      transactionInfo,
      chainId,
      requestEnvelope,
    )

    let request: DappRequest = transactionBundle
    if (this.extensionWindowManager.dappHasWindowOpen(port.sender.tab.id)) {
      request = { ...request, newRequest: true }
    }
    await this.requestStorage.set(request)
    await this.extensionWindowManager.createExtensionWindow(port.sender.tab.id)
  }

  private async onSelectiveDisclosure({ requestEnvelope, port }: ActionParams) {
    let request: DappRequest = { requestEnvelope }
    if (this.extensionWindowManager.dappHasWindowOpen(port.sender.tab.id)) {
      request = { ...request, newRequest: true }
    }
    await this.requestStorage.set(request)
    await this.extensionWindowManager.createExtensionWindow(port.sender.tab.id)
  }

  private handleErrorResponse = ({
    port,
    requestEnvelope,
    reason,
    errorCode,
    contextualInfo,
  }: HandleErrorResponseParams) => {
    this.requestStorage.clear()
    this.dappInfoStorage.clear()

    const responseEnvelope = createErrorResponseEnvelope(requestEnvelope, {
      reason,
      errorCode,
      contextualInfo: contextualInfo || '',
    })

    port.postMessage(responseEnvelope)
  }

  private handleInVaultError = async ({ port, error }: HandleInVaultErrorParams) => {
    let request: any = { requestError: error }
    if (this.extensionWindowManager.dappHasWindowOpen(port.sender.tab.id)) {
      request = { ...request, newRequest: true }
    }
    await this.requestStorage.set(request)
    this.extensionWindowManager.createExtensionWindow(port.sender.tab.id)
  }

  private getChainIdFromRequestEnvelope(requestEnvelope: SignatureProviderRequestEnvelope): string {
    const request = requestEnvelope.request
    if (instanceOfTransactionSignatureRequest(request)) {
      return request.transactionSignature.chainId
    }
    return null
  }
}
