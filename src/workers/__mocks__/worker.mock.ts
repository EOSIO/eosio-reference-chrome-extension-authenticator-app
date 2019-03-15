
export const postMessage = jest.fn()
export const addEventListener = jest.fn()
export const removeEventListener = jest.fn()
export const terminate = jest.fn()
export const onmessage = jest.fn()
export const dispatchEvent = jest.fn()
export const onerror = jest.fn()

const workerMock: Worker = {
  postMessage,
  addEventListener,
  removeEventListener,
  terminate,
  onmessage,
  dispatchEvent,
  onerror,
}

export default workerMock
