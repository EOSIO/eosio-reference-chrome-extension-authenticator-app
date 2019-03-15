import { AnyAction } from 'redux'

import { StorageSchema, StorageChangeCallback } from 'utils/storage/Storage'
import store from 'store/store'

export default abstract class BaseStorageListeners<TSchema extends StorageSchema> {
  protected storage: any
  private callbackId: string

  constructor(storage: any) {
    this.storage = storage
    this.callbackId = null
  }

  public start = () => {
    if (this.callbackId) { return }

    this.callbackId = this.storage.addListener(this.onChangeCallback)
  }

  public stop = () => {
    if (!this.callbackId) { return }

    this.storage.removeListener(this.callbackId)
    this.callbackId = null
  }

  public onChangeCallback: StorageChangeCallback<TSchema> = (newChanges: Partial<TSchema>) => {
    const storeState = store.getState()
    const updateAction = this.getUpdateAction(newChanges, storeState)

    store.dispatch(updateAction)
  }

  protected abstract getUpdateAction: (newChanges: Partial<TSchema>, storeState: any) => AnyAction
}
