// import chrome from "__mocks__/chrome.mock"

import Storage, { StorageAreaName, StorageChanges } from 'utils/storage/Storage'

declare var window: any

interface Schema {
  key: string
}

describe('Storage', () => {
  let storage: Storage<any>
  let storageArea: any
  let listenerCallback: jest.Mock

  beforeEach(() => {
    storageArea = {
      get: jest.fn((key: string, callback: any) => {
        if (key === 'key') {
          callback({ key: 'value' })
        }
      }),
      set: jest.fn((data: any, callback: any) => {
        callback()
      }),
      remove: jest.fn((key: string, callback: any) => {
        if (key === 'key') {
          callback()
        }
      }),
      clear: jest.fn((callback: any) => {
        callback()
      }),
    }

    window.chrome = {
      storage: {
        local: storageArea,
        sync: storageArea,
        onChanged: {
          addListener: jest.fn((callback: any) => {
            listenerCallback = callback
          }),
          removeListener: jest.fn((callback: any) => {
            if (listenerCallback === callback) {
              listenerCallback = null
            }
          }),
          hasListener: jest.fn((callback: any) => {
            return listenerCallback != null
          }),
        },
      },
      runtime: {
        lastError: undefined,
      },
    }

    storage = new Storage<Schema>(StorageAreaName.local)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('gets data from the storage area', async () => {
      const result = await storage.get('key')
      expect(result).toEqual({ key: 'value' })
    })

    it('rejects on chrome error', async (done) => {
      chrome.runtime.lastError = {
        message: 'an error',
      }

      try {
        await storage.get('key')
        done.fail('Promise was not rejected')
      } catch (e) {
        expect(e).toEqual({message: 'an error'})
        done()
      }
    })
  })

  describe('set', () => {
    it('sets data to the storage area', async () => {
      await storage.set({ key: 'value' })
      expect(storageArea.set).toHaveBeenCalledWith({ key: 'value' }, expect.any(Function))
    })

    it('rejects on chrome error', async (done) => {
      chrome.runtime.lastError = {
        message: 'an error',
      }

      try {
        await storage.set({ key: 'value' })
        done.fail('Promise was not rejected')
      } catch (e) {
        expect(e).toEqual({message: 'an error'})
        done()
      }
    })
  })

  describe('remove', () => {
    it('removes data from the storage area', async () => {
      await storage.remove('key')
      expect(storageArea.remove).toHaveBeenCalledWith('key', expect.any(Function))
    })

    it('rejects on chrome error', async (done) => {
      chrome.runtime.lastError = {
        message: 'an error',
      }

      try {
        await storage.remove('key')
        done.fail('Promise was not rejected')
      } catch (e) {
        expect(e).toEqual({message: 'an error'})
        done()
      }
    })
  })

  describe('clear', () => {
    it('clears data from the storage area', async () => {
      await storage.clear()
      expect(storageArea.clear).toHaveBeenCalled()
    })

    it('rejects on chrome error', async (done) => {
      chrome.runtime.lastError = {
        message: 'an error',
      }

      try {
        await storage.clear()
        done.fail('Promise was not rejected')
      } catch (e) {
        expect(e).toEqual({message: 'an error'})
        done()
      }
    })
  })

  describe('merge', () => {
    it('overrides primitive data', async () => {
      storageArea.get = jest.fn((keys: string[], callback: any) => {
        if (keys.includes('key')) {
          callback({ key: 'value1' })
        }
      })

      await storage.merge({ key: 'value2' })
      expect(storageArea.set).toHaveBeenCalledWith({ key: 'value2' }, expect.any(Function))
    })

    describe('arrays', () => {
      it('adds if no previous data', async () => {
        storageArea.get = jest.fn((keys: string[], callback: any) => {
          if (keys.includes('key')) {
            callback({})
          }
        })

        await storage.merge({ key: ['value2'] })
        expect(storageArea.set).toHaveBeenCalledWith({ key: ['value2'] }, expect.any(Function))
      })

      it('merges new data', async () => {
        storageArea.get = jest.fn((keys: string[], callback: any) => {
          if (keys.includes('key')) {
            callback({ key: ['value1'] })
          }
        })

        await storage.merge({ key: ['value2'] })
        expect(storageArea.set).toHaveBeenCalledWith({ key: ['value1', 'value2'] }, expect.any(Function))
      })
    })

    describe('objects', () => {
      it('adds if no previous data', async () => {
        storageArea.get = jest.fn((keys: string[], callback: any) => {
          if (keys.includes('key')) {
            callback({})
          }
        })

        await storage.merge({ key: { test2: 'value2' } })
        expect(storageArea.set).toHaveBeenCalledWith({ key: { test2: 'value2' } }, expect.any(Function))
      })

      it('merges new data', async () => {
        storageArea.get = jest.fn((keys: string[], callback: any) => {
          if (keys.includes('key')) {
            callback({ key: { test1: 'value1' } })
          }
        })

        await storage.merge({ key: { test2: 'value2' } })
        expect(storageArea.set).toHaveBeenCalledWith({
          key: {
            test1: 'value1',
            test2: 'value2',
          },
        }, expect.any(Function))
      })

      it('overrides old data', async () => {
        storageArea.get = jest.fn((keys: string[], callback: any) => {
          if (keys.includes('key')) {
            callback({ key: { test: 'value1' } })
          }
        })

        await storage.merge({ key: { test: 'value2' } })
        expect(storageArea.set).toHaveBeenCalledWith({ key: { test: 'value2' } }, expect.any(Function))
      })
    })
  })

  describe('listeners', () => {
    let changes: StorageChanges<Schema>

    beforeEach(() => {
      changes = {
        key: {
          oldValue: 'oldValue',
          newValue: 'newValue',
        },
      }
    })

    describe('addListener', () => {
      it('calls callback on storage change for array of scoped keys', () => {
        window.chrome.storage.onChanged.addListener = jest.fn((callback: any) => {
          callback(changes, 'local')
        })

        const listener = jest.fn()
        storage.addListener(listener, ['key'])
        expect(listener).toHaveBeenCalledWith({
          key: 'newValue',
        })
      })

      it('calls callback on storage change for single scoped key', () => {
        window.chrome.storage.onChanged.addListener = jest.fn((callback: any) => {
          callback(changes, 'local')
        })

        const listener = jest.fn()
        storage.addListener(listener, 'key')
        expect(listener).toHaveBeenCalledWith({
          key: 'newValue',
        })
      })

      it('does not call callback with a different area name', () => {
        window.chrome.storage.onChanged.addListener = jest.fn((callback: any) => {
          callback(changes, 'wrongAreaName')
        })

        const listener = jest.fn()
        storage.addListener(listener, ['key'])
        expect(listener).not.toHaveBeenCalled()
      })

      it('does not call callback when scoped keys does not match', () => {
        window.chrome.storage.onChanged.addListener = jest.fn((callback: any) => {
          callback(changes, 'local')
        })

        const listener = jest.fn()
        storage.addListener(listener, ['wrongKey'])
        expect(listener).not.toHaveBeenCalled()
      })
    })

    describe('removeListener', () => {
      it('does not call callback after removal', () => {
        const callback = jest.fn()
        const callbackId = storage.addListener(callback, ['key'])
        if (listenerCallback) {
          listenerCallback(changes, 'local')
        }
        storage.removeListener(callbackId)

        if (listenerCallback) {
          listenerCallback(changes, 'local')
        }
        expect(callback).toHaveBeenCalledTimes(1)
      })
    })

    describe('hasListener', () => {
      it('returns true if there is a listener', () => {
        const callback = jest.fn()
        const callbackId = storage.addListener(callback, ['key'])
        const result = storage.hasListener(callbackId)

        expect(result).toBe(true)
      })

      it('returns false if there is no listener', () => {
        const callback = jest.fn()
        const callbackId = storage.addListener(callback, ['key'])
        storage.removeListener(callbackId)
        const result = storage.hasListener(callbackId)

        expect(result).toBe(false)
      })
    })
  })
})
