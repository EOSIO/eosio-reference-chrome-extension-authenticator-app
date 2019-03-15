import * as DappMessenger from 'utils/requests/DappMessenger'

export const sendMessage = jest.fn()
export const closeCurrentWindow = jest.fn()
export const hasSentRequestId = jest.fn()

const DappMessengerMock = jest.spyOn(DappMessenger, 'default').mockImplementation(() => ({
  sendMessage,
  closeCurrentWindow,
  hasSentRequestId,
}))

export default DappMessengerMock
