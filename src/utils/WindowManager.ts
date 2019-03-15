import {
  USER_LAUNCHED_EXTENSION_TAB_ID,
  DEFAULT_WINDOW_SIZE,
  EXTENSION_HOME_POSITION,
  WINDOW_CASCADE_OFFSET,
} from 'constants/windowManager'

const ENTRY_FILE_NAME = 'index.html'

export enum WindowTypes {
  NORMAL = 'normal',
  POPUP = 'popup',
}

export enum WindowStates {
  NORMAL = 'normal',
  FULLSCREEN = 'fullscreen',
}

export interface ExtensionWindowConfig {
  height: number
  width: number
  top: number
  left: number
}

export class WindowManager {
  private requesterTabIdToExtensionTabId: {
    [tabId: number]: number,
  } = {}

  constructor() {
    chrome.tabs.onRemoved.addListener(this.onTabRemoved)
  }

  public async createExtensionWindow(
    dappTabId: number,
    config?: ExtensionWindowConfig,
  ): Promise<chrome.windows.Window> {
    if (this.dappHasWindowOpen(dappTabId)) {
      this.closeWindow(dappTabId)
    }

    const currentWindow = await this.getCurrentWindow()
    const activeTabs = await this.getActiveTabsInCurrentWindow()
    const currentWindowFullscreen = currentWindow.state === WindowStates.FULLSCREEN
    const extensionTab = await this.createTab(ENTRY_FILE_NAME, currentWindowFullscreen, activeTabs[0].index)

    this.requesterTabIdToExtensionTabId[dappTabId] = extensionTab.id

    if (currentWindowFullscreen) {
      // Returns the current window, which now has a new tab opened with the App
      return currentWindow
    }

    // Create a window, adding the App's tab to it
    const defaultConfig = this.getDefaultWindowConfig(currentWindow)
    config = { ...defaultConfig, ...config }
    const extensionWindow = await this.createWindow(extensionTab.id, config)
    return extensionWindow
  }

  public dappHasWindowOpen(dappTabId: number) {
    return this.requesterTabIdToExtensionTabId[dappTabId] ? true : false
  }

  private closeWindow(dappTabId: number) {
    const extTabId = this.requesterTabIdToExtensionTabId[dappTabId]
    delete this.requesterTabIdToExtensionTabId[dappTabId]
    chrome.tabs.remove(extTabId)
  }

  public closeCurrentWindow(delay: number = 0) {
    setTimeout(() => {
      window.close()
    }, delay)
  }

  public addCurrentWindowBeforeUnloadListener(callback: () => void) {
    window.addEventListener('beforeunload', callback)
  }

  public async showExtensionWindow() {
    let createdWindow = null
    // If extension has been instantiated, and user clicks icon button 2nd time, ensure windows are on top
    if (this.dappHasWindowOpen(USER_LAUNCHED_EXTENSION_TAB_ID)) {
      await this.bringTabsToTop()
    } else {
      createdWindow = await this.createExtensionWindow(USER_LAUNCHED_EXTENSION_TAB_ID)
    }

    return createdWindow
  }

  private getAppRequestedExtensionTabIds(): number[] {
    return Object.keys(this.requesterTabIdToExtensionTabId)
      .filter((key) => !(Number.parseInt(key, 10) === USER_LAUNCHED_EXTENSION_TAB_ID))
      .map((key) => {
        return this.requesterTabIdToExtensionTabId[key]
      })
  }

  private async bringTabsToTop() {
    const currentWindow = await this.getCurrentWindow()
    // To handle rapid, repeated clicks on extension icon button, bail if current window looks like the extension itself
    if (currentWindow.type === WindowTypes.POPUP) {
      return
    }

    let windowCounter = 0
    const extensionTabIds = this.getAppRequestedExtensionTabIds()
    extensionTabIds.forEach(async (val, idx, arr) => {
      await this.bringTabToTop(val, windowCounter++)
    })

    await this.bringTabToTop(this.requesterTabIdToExtensionTabId[USER_LAUNCHED_EXTENSION_TAB_ID], windowCounter)
  }

  private async bringTabToTop(tabId: number, cascadeOrdinal?: number) {
    return new Promise((resolve) => {
      chrome.tabs.get(tabId, async (tab) => {
        chrome.windows.get(tab.windowId, async (window) => {
          if (window.type === WindowTypes.NORMAL) {
            this.focusNormalTab(tabId)
          } else {
            this.focusPopupTab(tab, cascadeOrdinal)
          }
          resolve()
        })
      })
    })
  }

  private focusNormalTab(tabId: number): void {
    chrome.tabs.update(tabId, {
      active: true
    })
  }

  private async focusPopupTab(tab: chrome.tabs.Tab, cascadeOrdinal: number) {
    const cascadeOffset = cascadeOrdinal ? cascadeOrdinal * WINDOW_CASCADE_OFFSET : 0
    const extensionHomePos = await this.getExtensionHomePosition(tab)
    chrome.windows.update(tab.windowId, {
      top: extensionHomePos.top + cascadeOffset,
      left: extensionHomePos.left + cascadeOffset,
      focused: true,
    })
  }

  private getCurrentWindow(): Promise<chrome.windows.Window> {
    return new Promise((resolve) => {
      chrome.windows.getCurrent(resolve)
    })
  }

  private getActiveTabsInCurrentWindow(): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve)
    })
  }

  private createTab(fileName: string, active: boolean, index: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      chrome.tabs.create({
        url: chrome.extension.getURL(fileName),
        active,
        index,
      }, resolve)
    })
  }

  private createWindow(tabId: number, config: ExtensionWindowConfig): Promise<chrome.windows.Window> {
    return new Promise((resolve) => {
      chrome.windows.create({
        tabId,
        type: WindowTypes.POPUP,
        state: WindowStates.NORMAL,
        focused: true,
        ...config,
      }, resolve)
    })
  }

  private getDefaultWindowConfig(parentWindow: chrome.windows.Window): ExtensionWindowConfig {
    return {
      height: DEFAULT_WINDOW_SIZE.HEIGHT, // matching the height and width of iPhone 6-8 plus
      width: DEFAULT_WINDOW_SIZE.WIDTH,
      top: Math.round(parentWindow.top + EXTENSION_HOME_POSITION.windowOffsetFromTop),
      left: Math.round(parentWindow.left + parentWindow.width -
                      DEFAULT_WINDOW_SIZE.WIDTH - EXTENSION_HOME_POSITION.windowOffsetFromRight),
    }
  }

  private async getExtensionHomePosition(extensionTab: chrome.tabs.Tab): Promise<any> {
    const currentWindow = await this.getCurrentWindow()
    return {
      top: Math.round(currentWindow.top + EXTENSION_HOME_POSITION.windowOffsetFromTop),
      left: Math.round(currentWindow.left + currentWindow.width -
                      extensionTab.width - EXTENSION_HOME_POSITION.windowOffsetFromRight),
    }
  }

  private onTabRemoved = (removedTabId: number) => {
    const key = Object.keys(this.requesterTabIdToExtensionTabId).find((dappTabId) => {
      const extensionTabId = this.requesterTabIdToExtensionTabId[dappTabId]
      return extensionTabId === removedTabId
    })

    delete this.requesterTabIdToExtensionTabId[key]
  }
}

let defaultWindowManager: WindowManager
const getDefaultWindowManager = () => {
  if (!defaultWindowManager) {
    defaultWindowManager = new WindowManager()
  }
  return defaultWindowManager
}
export default getDefaultWindowManager
