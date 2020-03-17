const mock = ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  terminate: jest.fn(),
  onmessage: jest.fn(),
  dispatchEvent: jest.fn(),
  onerror: jest.fn(),
})

jest.mock('../EncryptWorker', () => (jest.fn().mockImplementation(() => mock)))

export default mock
