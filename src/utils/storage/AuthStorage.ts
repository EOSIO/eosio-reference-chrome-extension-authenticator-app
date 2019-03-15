import Storage, { StorageAreaName, StorageKeys, StorageChangeCallback } from 'utils/storage/Storage'
import Auth from 'utils/Auth'
import { DelayedRemovable } from 'store/AppState'

export interface AuthSchema {
  auths: Array<DelayedRemovable<Auth>>
}

const STORAGE_KEY: StorageKeys<AuthSchema> = 'auths'

export default class AuthStorage {
  private storage: Storage<AuthSchema>

  constructor() {
    this.storage = new Storage<AuthSchema>(StorageAreaName.sync)
  }

  public async get(): Promise<Auth[]> {
    const { auths } = await this.storage.get(STORAGE_KEY)
    return auths || []
  }

  public async set(auths: Auth[]) {
    await this.storage.set({
      auths,
    })
  }

  public async clear() {
    return await this.storage.remove(STORAGE_KEY)
  }

  public addListener(callback: StorageChangeCallback<AuthSchema>): string {
    return this.storage.addListener(callback, STORAGE_KEY)
  }

  public removeListener(callbackId: string): void {
    this.storage.removeListener(callbackId)
  }

  public hasListener(callbackId: string): boolean {
    return this.storage.hasListener(callbackId)
  }
}
