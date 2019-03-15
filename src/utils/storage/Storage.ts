import { v4 as uuid } from 'uuid'

export interface StorageSchema {
  [key: string]: any
}

export type StorageKeys<TSchema extends StorageSchema> = keyof TSchema | Array<keyof TSchema>

export enum StorageAreaName {
  local = 'local',
  sync = 'sync',
}

export type StorageChanges<TSchema extends StorageSchema> = {
  [Key in keyof TSchema]: {
    newValue?: TSchema[Key],
    oldValue?: TSchema[Key],
  }
}

export type StorageChangeCallback<TSchema extends StorageSchema> = (newChanges: Partial<TSchema>) => void
type StorageChangeScopedCallback<TSchema extends StorageSchema> = (
  changes: StorageChanges<TSchema>,
  areaName: string,
) => void

export default class Storage<TSchema> {
  private static callbackMap: {
    [callbackId: string]: StorageChangeScopedCallback<any>,
  } = {}
  private storageAreaName: StorageAreaName
  private storageArea: chrome.storage.StorageArea

  constructor(storageAreaName: StorageAreaName) {
    this.storageAreaName = storageAreaName
    this.storageArea = chrome.storage[storageAreaName]
  }

  public async get<TKeys extends StorageKeys<TSchema>>(keys: TKeys): Promise<Partial<TSchema>> {
    return new Promise((resolve, reject): void => {
      this.storageArea.get(keys, (data: Partial<TSchema>) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(data)
        }
      })
    }) as Promise<Partial<TSchema>>
  }

  public async set(data: Partial<TSchema>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    }) as Promise<void>
  }

  public async merge(data: Partial<TSchema>): Promise<void> {
    const keys = Object.keys(data) as StorageKeys<TSchema>
    const currentData = await this.get(keys)

    const mergedData = Object.keys(data).reduce((result: Partial<TSchema>, key: string) => {
      if (currentData[key] instanceof Array) {
        result[key] = [...currentData[key], ...data[key]]
      } else if (currentData[key] instanceof Object) {
        result[key] = {...currentData[key], ...data[key]}
      } else {
        result[key] = data[key]
      }

      return result
    }, {})

    return this.set(mergedData)
  }

  public async remove<TKeys extends StorageKeys<TSchema>>(keys: TKeys): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.storageArea.remove(keys as string | string[], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    }) as Promise<void>
  }

  public async clear(): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.storageArea.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    }) as Promise<void>
  }

  /**
   * @param callback - The function to be called on storage change.
   * @param keys - The keys to listen to changes for.
   * @returns callbackId that can be used in the `removeListener` and `hasListener` functions.
   */
  public addListener(callback: StorageChangeCallback<TSchema>, keys: StorageKeys<TSchema>): string {
    if (keys && !Array.isArray(keys)) {
      keys = [keys]
    }

    const scopedCallback: StorageChangeScopedCallback<TSchema> = (changes, areaName) => {
      if (areaName !== this.storageAreaName.toString()) { return }
      const newChanges = this.getNewChanges(changes, keys as string[])
      if (!Object.keys(newChanges).length) { return }
      callback(newChanges)
    }

    const callbackId = uuid()
    Storage.callbackMap[callbackId] = scopedCallback

    chrome.storage.onChanged.addListener(scopedCallback)
    return callbackId
  }

  /**
   * @param callbackId - The id that is returned from the `addListener` function.
   */
  public removeListener(callbackId: string): void {
    const scopedCallback = Storage.callbackMap[callbackId]
    chrome.storage.onChanged.removeListener(scopedCallback)
    delete Storage.callbackMap[callbackId]
  }

  /**
   * @param callbackId - The id that is returned from the `addListener` function.
   */
  public hasListener(callbackId: string): boolean {
    const scopedCallback = Storage.callbackMap[callbackId]
    return chrome.storage.onChanged.hasListener(scopedCallback)
  }

  private getNewChanges(changes: StorageChanges<TSchema>, keys: string[]): Partial<TSchema> {
    return Object.keys(changes).reduce((result: Partial<TSchema>, key) => {
      if (keys.includes(key)) {
        result[key] = changes[key].newValue
      }
      return result
    }, {})
  }
}
