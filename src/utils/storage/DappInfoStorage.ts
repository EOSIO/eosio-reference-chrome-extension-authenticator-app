import Storage, { StorageAreaName, StorageChangeCallback, StorageKeys } from 'utils/storage/Storage'
import { DappInfo } from 'utils/manifest/DappInfo'

interface Schema {
  dappInfo: DappInfo,
}

const STORAGE_KEY: StorageKeys<Schema> = 'dappInfo'

export default class DappInfoStorage {
  private storage: Storage<Schema>

  constructor() {
    this.storage = new Storage<Schema>(StorageAreaName.local)
  }

  public async getDappInfo() {
    const { dappInfo } = await this.storage.get(STORAGE_KEY)
    return dappInfo
  }

  public async setDappInfo(dappInfo: DappInfo) {
    return await this.storage.set({ dappInfo })
  }

  public async clear() {
    return await this.storage.remove(STORAGE_KEY)
  }

  public addListener(callback: StorageChangeCallback<Schema>): string {
    return this.storage.addListener(callback, STORAGE_KEY)
  }

  public removeListener(callbackId: string): void {
    this.storage.removeListener(callbackId)
  }

  public hasListener(callbackId: string): boolean {
    return this.storage.hasListener(callbackId)
  }
}
