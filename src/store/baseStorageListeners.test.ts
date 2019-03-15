import '__mocks__/chrome.mock'
import * as storeMocks from 'store/__mocks__/store.mock'
import { AnyAction } from 'redux'

import BaseStorageListeners from './baseStorageListeners'

interface TestStorageSchema {
  name: string
}

/* tslint:disable:max-classes-per-file */
class TestStorage {
  public addListener = jest.fn().mockReturnValue('I am a listener')
  public removeListener = jest.fn()
}

class TestStorageListeners extends BaseStorageListeners<TestStorageSchema> {
  private changes: Partial<TestStorageSchema>
  private storeState: any

  constructor() {
    super(new TestStorage())

    this.changes = null
  }

  protected getUpdateAction: (newChanges: Partial<TestStorageSchema>, storeState: any) => AnyAction =
    (newChanges, storeState) => {
      this.changes = newChanges
      this.storeState = storeState

      return { type: 'test action' }
    }

  public getChanges = () => this.changes
  public getStoreState = () => this.storeState
  public getStorage = () => this.storage
}

describe('StorageListeners', () => {
  let testStorageListeners: TestStorageListeners

  beforeEach(() => {
    testStorageListeners = new TestStorageListeners()
  })

  describe('when started', () => {
    beforeEach(() => {
      testStorageListeners.start()
    })

    it('add the listener to the storage', () => {
      expect(testStorageListeners.getStorage().addListener)
        .toHaveBeenCalledWith(testStorageListeners.onChangeCallback)
    })

    it('only adds the listener once', () => {
      testStorageListeners.start()

      expect(testStorageListeners.getStorage().addListener).toHaveBeenCalledTimes(1)
    })

    it('removes the listener on stop', () => {
      testStorageListeners.stop()

      expect(testStorageListeners.getStorage().removeListener).toHaveBeenCalledWith('I am a listener')
    })
  })

  describe('when not started', () => {
    it('does not removes the (non-existent) listener on stop', () => {
      testStorageListeners.stop()

      expect(testStorageListeners.getStorage().removeListener).not.toHaveBeenCalled()
    })
  })

  describe('on change callback', () => {
    beforeEach(() => {
      storeMocks.getState.mockReturnValue('store state')

      testStorageListeners.onChangeCallback({ name: 'test name' })
    })

    it('calls the getUpdateAction method', () => {
      expect(testStorageListeners.getChanges()).toEqual({ name: 'test name' })
      expect(testStorageListeners.getStoreState()).toEqual('store state')
    })

    it('dispatches the returned action', () => {
      expect(storeMocks.dispatch).toHaveBeenCalledWith({ type: 'test action' })
    })
  })
})
