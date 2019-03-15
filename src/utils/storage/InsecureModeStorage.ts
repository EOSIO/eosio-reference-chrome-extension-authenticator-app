import Storage, { StorageAreaName, StorageChangeCallback, StorageKeys } from 'utils/storage/Storage'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'

const STORAGE_KEYS: StorageKeys<InsecureMode> = ['enabled', 'whitelist']

export default class InsecureModeStorage {
  private storage: Storage<InsecureMode>

  constructor() {
    this.storage = new Storage<InsecureMode>(StorageAreaName.local)
  }

  public async get(): Promise<InsecureMode> {
    const insecureMode = await this.storage.get(STORAGE_KEYS) as Required<InsecureMode>
    return insecureMode
  }

  public async set(insecureMode: Partial<InsecureMode>) {
    return await this.storage.set(insecureMode)
  }

  public addListener(callback: StorageChangeCallback<InsecureMode>): string {
    return this.storage.addListener(callback, STORAGE_KEYS)
  }

  public removeListener(callbackId: string): void {
    this.storage.removeListener(callbackId)
  }

  public hasListener(callbackId: string): boolean {
    return this.storage.hasListener(callbackId)
  }
}
