import * as backgroundMessageHandlerMocks from 'background/__mocks__/BackgroundMessageHandler.mock'

declare var global: any

describe('Background', () => {
  let port: any
  let runtimeConnectCallback: any
  let runtimeMessageCallback: any
  let portMessageCallback: any
  let portDisconnectCallback: any
  let browserActionCallback: any

  beforeEach(() => {
    jest.clearAllMocks()

    port = {
      onMessage: {
        addListener: jest.fn((callback) => {
          portMessageCallback = callback
        }),
      },
      onDisconnect: {
        addListener: jest.fn((callback) => {
          portDisconnectCallback = callback
        }),
      },
      postMessage: jest.fn(),
    }

    global.chrome = {
      runtime: {
        onConnect: {
          addListener: jest.fn((callback) => {
            runtimeConnectCallback = callback
          }),
        },
        onMessage: {
          addListener: jest.fn((callback) => {
            runtimeMessageCallback = callback
          }),
        },
      },
      browserAction: {
        onClicked: {
          addListener: jest.fn((callback) => {
            browserActionCallback = callback
          }),
        },
      },
    } as any

    require('./background')
  })

  describe('on connect', () => {
    beforeEach(async () => {
      await runtimeConnectCallback(port)
    })

    describe('on port message', () => {
      beforeEach(async () => {
        await portMessageCallback('requestEnvelope', port)
      })

      it('handles port message', () => {
        backgroundMessageHandlerMocks.onRequest(port, 'requestEnvelope')
      })
    })

    describe('on port disconnect', () => {
      beforeEach(async () => {
        await portDisconnectCallback()
      })

      it('handles port disconnect', () => {
        backgroundMessageHandlerMocks.onPortDisconnect(port)
      })
    })
  })

  describe('on runtime message', () => {
    beforeEach(async () => {
      await runtimeMessageCallback('responseEnvelope')
    })

    it('handles runtime message', () => {
      backgroundMessageHandlerMocks.onResponse('responseEnvelope')
    })
  })

  describe('on browser action', () => {
    beforeEach(async () => {
      await browserActionCallback()
    })

    it('handles runtime message', () => {
      backgroundMessageHandlerMocks.onBrowserAction()
    })
  })
})
