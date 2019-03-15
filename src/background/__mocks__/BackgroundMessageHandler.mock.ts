import '__mocks__/chrome.mock'
import * as BackgroundMessageHandler from 'background/BackgroundMessageHandler'

export const onRequest = jest.fn()
export const onResponse = jest.fn()
export const onPortDisconnect = jest.fn()
export const onBrowserAction = jest.fn()

export const backgroundMessageHandlerMock = {
  onRequest,
  onResponse,
  onPortDisconnect,
  onBrowserAction,
}

jest.spyOn(BackgroundMessageHandler, 'default').mockImplementation(() => backgroundMessageHandlerMock)
