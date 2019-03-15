import * as workerMocks from 'workers/__mocks__/worker.mock'

import * as workerMessaging from 'workers/utils/workerMessaging'

describe('workerMessaging', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('postMessage', () => {
    let worker: Worker

    beforeEach(() => {
      worker = workerMocks.default
    })

    describe('always', () => {
      beforeEach(async () => {
        workerMocks.addEventListener.mockImplementation((eventType, callback) => {
          if (eventType === 'message') {
            callback({ data: 'result' })
          }
        })

        await workerMessaging.postMessage<string, string>(worker, 'message')
      })

      it('posts the message to the worker', () => {
        expect(worker.postMessage).toHaveBeenCalledWith('message')
      })
    })

    describe('on success', () => {
      let result: string
      let eventListener: any

      beforeEach(async () => {
        workerMocks.addEventListener.mockImplementation((eventType, callback) => {
          if (eventType === 'message') {
            eventListener = callback
            callback({ data: 'result' })
          }
        })

        result = await workerMessaging.postMessage<string, string>(worker, 'message')
      })

      it('resolves with result', () => {
        expect(result).toEqual('result')
      })

      it('removes the event listener', () => {
        expect(workerMocks.removeEventListener).toHaveBeenCalledWith('message', eventListener)
      })

      it('terminates the worker', () => {
        expect(workerMocks.terminate).toHaveBeenCalledTimes(1)
      })
    })

    describe('on error', () => {
      let eventListener: any

      beforeEach(async () => {
        workerMocks.addEventListener.mockImplementation((eventType, callback) => {
          if (eventType === 'message') {
            eventListener = callback
            callback({ data: { error: 'error' } })
          }
        })
      })

      it('resolves with result', async (done) => {
        try {
          await workerMessaging.postMessage<string, string>(worker, 'message')
        } catch (e) {
          expect(e.message).toEqual('error')
          return done()
        }

        done.fail('error was not caught')
      })

      it('removes the event listener', async (done) => {
        try {
          await workerMessaging.postMessage<string, string>(worker, 'message')
        } catch (e) {
          expect(workerMocks.removeEventListener).toHaveBeenCalledWith('message', eventListener)
          return done()
        }

        done.fail('error was not caught')
      })

      it('terminates the worker', async (done) => {
        try {
          await workerMessaging.postMessage<string, string>(worker, 'message')
        } catch (e) {
          expect(workerMocks.terminate).toHaveBeenCalledTimes(1)
          return done()
        }

        done.fail('error was not caught')
      })
    })
  })
})
