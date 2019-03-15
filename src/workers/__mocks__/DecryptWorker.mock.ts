const mock = ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  terminate: jest.fn(),
  onmessage: jest.fn(),
  dispatchEvent: jest.fn(),
  onerror: jest.fn(),
})

jest.mock('../DecryptWorker', () => ({ default: jest.fn().mockImplementation(() => mock) }))

export default mock
