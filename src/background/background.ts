/* global chrome */
import 'babel-polyfill'
import {
  SignatureProviderRequestEnvelope,
} from 'eosjs-signature-provider-interface'

import BackgroundMessageHandler from 'background/BackgroundMessageHandler'

const backgroundMessageHandler = new BackgroundMessageHandler()

// incoming requests from Dapp to extension (automated response or to new extension popup window)
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  port.onMessage.addListener((requestEnvelope: SignatureProviderRequestEnvelope) => {
    backgroundMessageHandler.onRequest(port, requestEnvelope)
  })

  port.onDisconnect.addListener(backgroundMessageHandler.onPortDisconnect)
})

// outgoing responses from extension pop up tab window back to Dapp
chrome.runtime.onMessage.addListener(backgroundMessageHandler.onResponse)

// extension button in browser pressed by user
chrome.browserAction.onClicked.addListener(backgroundMessageHandler.onBrowserAction)
