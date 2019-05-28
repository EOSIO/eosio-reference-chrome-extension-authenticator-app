import {
  SignatureProviderResponseEnvelope,
} from 'eosjs-signature-provider-interface'

export class DappMessenger {
  private sentRequestIds: string[] = []

  public sendMessage(responseEnvelope: SignatureProviderResponseEnvelope) {
    if (this.hasSentRequestId(responseEnvelope.id)) { return }

    this.sentRequestIds.push(responseEnvelope.id)

    // TODO: Sending plain text response envelopes over chrome.runtime is a security risk! Need to fix this
    chrome.runtime.sendMessage(responseEnvelope)
  }

  public hasSentRequestId(requestId: string) {
    return this.sentRequestIds.find((sentRequestId) => sentRequestId === requestId) !== undefined
  }
}

let defaultDappMessenger: DappMessenger
const getDefaultDappMessenger = () => {
  if (!defaultDappMessenger) {
    defaultDappMessenger = new DappMessenger()
  }
  return defaultDappMessenger
}

export default getDefaultDappMessenger
