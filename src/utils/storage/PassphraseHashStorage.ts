import Storage, { StorageAreaName, StorageKeys, StorageChangeCallback } from 'utils/storage/Storage'

export interface PassphraseHashSchema {
  hash: string
}

const STORAGE_KEYS: StorageKeys<PassphraseHashSchema> = ['hash']

export default class PassphraseHashStorage {
  private storage: Storage<PassphraseHashSchema>

  constructor() {
    this.storage = new Storage<PassphraseHashSchema>(StorageAreaName.sync)
  }

  public async get(): Promise<string> {
    const { hash } = await this.storage.get(STORAGE_KEYS) as Required<PassphraseHashSchema>
    return hash
  }

  public async set(hash: string) {
    return await this.storage.set({ hash })
  }

  public addListener(callback: StorageChangeCallback<PassphraseHashSchema>): string {
    return this.storage.addListener(callback, STORAGE_KEYS)
  }

  public removeListener(callbackId: string): void {
    this.storage.removeListener(callbackId)
  }

  public hasListener(callbackId: string): boolean {
    return this.storage.hasListener(callbackId)
  }
}
