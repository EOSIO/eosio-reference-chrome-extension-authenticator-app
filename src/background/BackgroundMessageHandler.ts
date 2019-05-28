import {
  SignatureProviderRequestEnvelope,
  SignatureProviderResponseEnvelope,
} from 'eosjs-signature-provider-interface'

import getDefaultWindowManager from 'utils/WindowManager'
import ActionHandler from 'background/ActionHandler'
import ManifestProvider from 'utils/manifest/ManifestProvider'

export default class BackgroundMessageHandler {
  private windowManager = getDefaultWindowManager()
  private actionHandler = new ActionHandler()
  private portIdToManifestProviderMap: {
    [portId: number]: ManifestProvider,
  } = {}
  private requestIdToPortMap: {
    [requestId: string]: chrome.runtime.Port,
  } = {}

  public onRequest = async (port: chrome.runtime.Port, requestEnvelope: SignatureProviderRequestEnvelope) => {
    const { id } = requestEnvelope
    const manifestProvider = this.getManifestProvider(port.sender.tab.id, requestEnvelope)

    this.requestIdToPortMap[id] = port
    this.actionHandler.handleAction({
      requestEnvelope,
      port,
      manifestProvider,
    })
  }

  public onResponse = (responseEnvelope: SignatureProviderResponseEnvelope) => {
    const port = this.requestIdToPortMap[responseEnvelope.id]

    // TODO: determine when port will be null/undefined and how to handle that case (chrome notification)
    if (!port) { return }

    port.postMessage(responseEnvelope)

    delete this.requestIdToPortMap[responseEnvelope.id]
  }

  public onPortDisconnect = (port: chrome.runtime.Port) => {
    const portRequestId = Object.keys(this.requestIdToPortMap)
      .find((requestId) => this.requestIdToPortMap[requestId] === port)

    delete this.requestIdToPortMap[portRequestId]
    delete this.portIdToManifestProviderMap[port.sender.tab.id]
  }

  public onBrowserAction = () => {
    this.windowManager.showExtensionWindow()
  }

  /**
   * @description Lazy loads and caches Manifest Providers
   */
  private getManifestProvider(
    portId: number,
    requestEnvelope: SignatureProviderRequestEnvelope,
  ): ManifestProvider {
    const { declaredDomain } = requestEnvelope
    let manifestProvider = this.portIdToManifestProviderMap[portId]

    // Make sure the declaredDomain is still the same for the given portId
    if (manifestProvider && manifestProvider.declaredDomain !== declaredDomain) {
      delete this.requestIdToPortMap[portId]
      manifestProvider = null
    }

    if (!manifestProvider) {
      this.portIdToManifestProviderMap[portId] = new ManifestProvider(requestEnvelope.declaredDomain)
      manifestProvider = this.portIdToManifestProviderMap[portId]
    }

    return manifestProvider
  }
}
