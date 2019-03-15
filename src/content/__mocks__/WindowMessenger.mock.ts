import '__mocks__/chrome.mock'

import * as WindowMessenger from 'content/WindowMessenger'

export const setUpMessageListeners = jest.fn()

const WindowMessengerMock = jest.spyOn(WindowMessenger, 'default').mockImplementation(() => ({
  setUpMessageListeners,
}))

export default WindowMessengerMock
