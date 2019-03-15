import Storage, { StorageKeys, StorageAreaName, StorageChangeCallback } from 'utils/storage/Storage'
import DappRequest from 'utils/requests/DappRequest'

const STORAGE_KEYS: StorageKeys<DappRequest> = ['transactionInfo', 'requestEnvelope', 'requestError', 'newRequest']

export default class RequestStorage {
  private storage: Storage<DappRequest>

  constructor() {
    this.storage = new Storage<DappRequest>(StorageAreaName.local)
  }

  public async get(): Promise<DappRequest> {
    const request = await this.storage.get(STORAGE_KEYS) as Required<DappRequest>
    return request
  }

  public async set(request: Partial<DappRequest>) {
    return await this.storage.set(request)
  }

  public async clear() {
    return await this.storage.remove(STORAGE_KEYS)
  }

  public addListener(callback: StorageChangeCallback<DappRequest>): string {
    return this.storage.addListener(callback, STORAGE_KEYS)
  }

  public removeListener(callbackId: string): void {
    this.storage.removeListener(callbackId)
  }

  public hasListener(callbackId: string): boolean {
    return this.storage.hasListener(callbackId)
  }
}
