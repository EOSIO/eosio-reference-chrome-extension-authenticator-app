import {
  instanceOfRequestEnvelope,
  instanceOfResponseEnvelope,
  unpackEnvelope,
  SignatureProviderResponseEnvelope,
  packEnvelope,
  ErrorCodes,
  SignatureProviderRequestEnvelope,
} from 'eosjs-signature-provider-interface'

import { createErrorResponseEnvelope } from 'utils/requests/signatureProviderEnvelopeGenerators'
import {
  instanceOfInstallValidationRequestEnvelope,
  instanceOfInstallValidationResponseEnvelope,
} from 'utils/requests/installationCheckRequestHelpers'

const ERROR_MESSAGES = {
  PORT_NOT_FOUND: 'Could not communicate with the vault.',
  DECLARED_DOMAIN_NOT_FOUND: 'Could not securely send response to declared domain.',
}

export class WindowMessenger {
  private port: chrome.runtime.Port
  private requestIdToDeclaredDomainMap: {
    [requestId: string]: string,
  } = {}

  constructor(port?: chrome.runtime.Port) {
    this.port = port || chrome.runtime.connect()
  }

  public setUpMessageListeners() {
    this.port.onMessage.addListener(this.onPortMessage)
    window.addEventListener('message', this.onWindowMessage)

    this.port.onDisconnect.addListener(() => {
      this.port = null
    })
  }

  private onWindowMessage = (event: MessageEvent) => {
    const messageOriginURL = new URL(event.origin)
    const currentWindowURL = new URL(window.location.href)
    if (messageOriginURL.origin !== currentWindowURL.origin) {
      return
    }

    let requestEnvelope: SignatureProviderRequestEnvelope
    try {
      requestEnvelope = unpackEnvelope(event.data)
    } catch (e) {
      return
    }

    // TODO: remove instanceOfInstallValidationRequestEnvelope and update instanceOf to include installationCheck action
    if (!instanceOfRequestEnvelope(requestEnvelope)
      && !instanceOfInstallValidationRequestEnvelope(requestEnvelope)) {
      return
    }

    if (!this.port) {
      const responseEnvelope = createErrorResponseEnvelope(requestEnvelope, {
        reason: ERROR_MESSAGES.PORT_NOT_FOUND,
        errorCode: ErrorCodes.vaultError,
        contextualInfo: '',
      })
      this.sendResponse(responseEnvelope, requestEnvelope.declaredDomain)
      return
    }

    this.requestIdToDeclaredDomainMap[requestEnvelope.id] = requestEnvelope.declaredDomain
    this.port.postMessage(requestEnvelope)
  }

  private onPortMessage = (responseEnvelope: SignatureProviderResponseEnvelope) => {
    // TODO: remove instanceOfInstallValidationResponseEnvelope
    // and update instanceOf to include installationCheck action
    if (!instanceOfResponseEnvelope(responseEnvelope)
      && !instanceOfInstallValidationResponseEnvelope(responseEnvelope)) { return }

    let targetOrigin = this.requestIdToDeclaredDomainMap[responseEnvelope.id]

    if (!targetOrigin) {
      responseEnvelope = createErrorResponseEnvelope(responseEnvelope, {
        reason: ERROR_MESSAGES.DECLARED_DOMAIN_NOT_FOUND,
        errorCode: ErrorCodes.vaultError,
        contextualInfo: '',
      })
      targetOrigin = '*'
    }

    this.sendResponse(responseEnvelope, targetOrigin)
    delete this.requestIdToDeclaredDomainMap[responseEnvelope.id]
  }

  private sendResponse(responseEnvelope: SignatureProviderResponseEnvelope, targetOrigin: string) {
    const packedEnvelope = packEnvelope(responseEnvelope)
    window.postMessage(packedEnvelope, targetOrigin)
  }
}

let defaultWindowMessenger: WindowMessenger
const getDefaultWindowMessenger = () => {
  if (!defaultWindowMessenger) {
    defaultWindowMessenger = new WindowMessenger()
  }
  return defaultWindowMessenger
}

export default getDefaultWindowMessenger
