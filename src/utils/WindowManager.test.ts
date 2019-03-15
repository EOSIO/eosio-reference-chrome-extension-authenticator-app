import chrome from '__mocks__/chrome.mock'

import { DEFAULT_WINDOW_SIZE, WINDOW_CASCADE_OFFSET, EXTENSION_HOME_POSITION } from 'constants/windowManager'

import * as WindowManagerImport from 'utils/WindowManager'

declare var window: any

jest.useFakeTimers()

describe('WindowManager', () => {
  let windowManager: WindowManagerImport.WindowManager
  let extensionWindow: any
  let currentWindow: any
  let config: WindowManagerImport.ExtensionWindowConfig
  let tabId: number
  let windowId: number

  const WindowTypes = WindowManagerImport.WindowTypes
  const WindowStates = WindowManagerImport.WindowStates

  beforeEach(() => {
    jest.clearAllMocks()
    chrome.reset()

    currentWindow = {
      top: 10,
      left: 10,
      height: 100,
      width: 100,
    }

    config = {
      top: 20,
      left: 20,
      height: 200,
      width: 200,
    }

    window.close = jest.fn()

    windowId = 3
    tabId = 2

    extensionWindow = {
      type: WindowTypes.POPUP,
      tabs: [
        { id: tabId },
      ],
    }

    chrome.windows.getCurrent.callsFake((resolve) => resolve(currentWindow))

    chrome.tabs.query.withArgs({
      active: true,
      currentWindow: true,
    }).callsFake((query, resolve) => resolve([{
      index: 1,
    }]))

    chrome.tabs.remove.withArgs(tabId).callsFake(jest.fn())

    chrome.windows.create.withArgs({
      tabId,
      type: WindowTypes.POPUP,
      state:  WindowStates.NORMAL,
      focused: true,
      height: 200,
      width: 200,
      top: 20,
      left: 20,
    }).callsFake((args, resolve) => resolve(extensionWindow))

    chrome.tabs.create.withArgs({
      url: 'indexURL',
      active: false,
      index: 1,
    }).callsFake((args, resolve) => resolve({
      id: tabId,
    }))

    chrome.extension.getURL.returns('indexURL')

    windowManager = new WindowManagerImport.WindowManager()
  })

  describe('createExtensionWindow', () => {
    it('closes the current window and creates a window for a tabId that already has an open window', async () => {
      const window1 = await windowManager.createExtensionWindow(tabId, config)
      const window2 = await windowManager.createExtensionWindow(tabId, config)

      expect(window1).toBe(extensionWindow)
      expect(window2).toBe(extensionWindow)
      expect(chrome.tabs.remove.calledOnce).toBe(true)
    })

    it('creates an extension window for a tabId that had another extension window closed', async () => {
      const window1 = await windowManager.createExtensionWindow(tabId, config)
      chrome.tabs.onRemoved.dispatch(window1.tabs[0].id)
      const window2 = await windowManager.createExtensionWindow(tabId, config)

      expect(window2).toBe(extensionWindow)
    })

    describe('when not fullscreen', () => {
      it('creates a new window', async () => {
        currentWindow.state = WindowStates.NORMAL
        const result = await windowManager.createExtensionWindow(1, config)

        expect(result).toBe(extensionWindow)
      })
    })

    describe('when fullscreen', () => {
      it('doesn\'t create a new window', async () => {
        chrome.tabs.create.withArgs({
          url: 'indexURL',
          active: true,
          index: 1,
        }).callsFake((args, resolve) => resolve({
          id: tabId,
        }))

        currentWindow.state = WindowStates.FULLSCREEN
        const result = await windowManager.createExtensionWindow(1, config)

        expect(result).toBe(currentWindow)
      })
    })
  })

  describe('when user clicks extension\'s icon button', () => {
    const winUpdateArgs = {
      top: 90,
      left: -10,
      focused: true,
    }
    currentWindow = {
      top: 10,
      left: 10,
      height: 100,
      width: 100,
    }
    const newWindowConfig = {
      height: DEFAULT_WINDOW_SIZE.HEIGHT,
      width: DEFAULT_WINDOW_SIZE.WIDTH,
      top: 90,
      left: Math.round(currentWindow.left + currentWindow.width -
        DEFAULT_WINDOW_SIZE.WIDTH - EXTENSION_HOME_POSITION.windowOffsetFromRight),
    }

    beforeEach(() => {
      chrome.tabs.get.withArgs(tabId).callsFake((args, resolve) => resolve({
        windowId,
        width: 50,
      }))

      chrome.windows.get.withArgs(windowId).callsFake((args, resolve) => resolve({
        type: WindowTypes.POPUP
      }))

      chrome.tabs.create.withArgs({
        url: 'indexURL',
        active: false,
        index: 1,
      }).callsFake((args, resolve) => resolve({
        id: tabId,
      }))

      chrome.windows.create.withArgs({
        tabId,
        type: WindowTypes.POPUP,
        state: WindowStates.NORMAL,
        focused: true,
        ...newWindowConfig,
      }).callsFake((args, resolve) => resolve(newWindowConfig))
    })

    it('creates the extension window in its default location', async () => {
      // First user click opens main extension window
      extensionWindow = await windowManager.showExtensionWindow()
      expect(chrome.windows.create.calledOnce).toBe(true)
      expect(chrome.windows.update.notCalled).toBe(true)

      const getPosFromWindow = (win: any) => ({left: win.left, top: win.top, width: win.width, height: win.height})
      expect(getPosFromWindow(extensionWindow)).toEqual(getPosFromWindow(newWindowConfig))
    })

    describe('for the second time', () => {

      describe('extension window is a normal type', () => {

        beforeEach(async () => {
          chrome.windows.get.withArgs(windowId).callsFake((args, resolve) => resolve({
            type: WindowTypes.NORMAL
          }))

          chrome.tabs.create.withArgs({
            url: 'indexURL',
            active: true,
            index: 1,
          }).callsFake((args, resolve) => resolve({
            id: tabId,
          }))

          chrome.tabs.update.withArgs(tabId, { active: true }).callsFake(() => {
            return
          })

          currentWindow.state = WindowStates.FULLSCREEN

          await windowManager.showExtensionWindow()

          chrome.windows.create.resetHistory()
          chrome.tabs.update.resetHistory()
          chrome.tabs.get.resetHistory()
          chrome.windows.get.resetHistory()
        })

        it('2nd click of extension icon does not create a new window', async () => {
          const extensionWindow2ndClick = await windowManager.showExtensionWindow()

          // second press doesn't create another window
          expect(extensionWindow2ndClick).toBe(null)
          expect(chrome.windows.create.notCalled).toBe(true)
        })

        it('2nd click of extension icon brings existing extension tab into focus', async () => {
          await windowManager.showExtensionWindow()

          // Pre-existing extension tab gets focused
          expect(chrome.tabs.update.calledOnce).toBe(true)
          expect(chrome.tabs.update.calledWith(tabId, { active: true })).toBe(true)
        })
      })

      describe('extension window is a popup type', () => {

        beforeEach(async () => {
          chrome.windows.update.withArgs(windowId, winUpdateArgs).callsFake(() => {
            return
          })

          // First user click opens main extension window
          extensionWindow = await windowManager.showExtensionWindow()

          chrome.windows.update.resetHistory()
          chrome.windows.create.resetHistory()
          chrome.tabs.get.resetHistory()
          chrome.windows.get.resetHistory()
        })

        it('2nd click of extension icon does not create a new window', async () => {
          const extensionWindow2ndClick = await windowManager.showExtensionWindow()

          // second press doesn't create another window
          expect(extensionWindow2ndClick).toBe(null)
          expect(chrome.windows.create.notCalled).toBe(true)
        })

        it('2nd click of extension icon brings existing extension window to the front', async () => {
          // 2nd user click simply brings extension window to the front
          await windowManager.showExtensionWindow()

          // Existing extension window gets brought to front
          expect(chrome.windows.update.calledOnce).toBe(true)
          expect(chrome.windows.update.calledWith(windowId, winUpdateArgs)).toBe(true)
        })

        it('won\'t try to bring to front the extension window if it\'s already on top', async () => {
          chrome.windows.getCurrent.callsFake((resolve) => resolve({
            type: WindowTypes.POPUP,
            ...currentWindow,
          }))
          // 2nd user click simply brings extension window to the front
          chrome.windows.update.resetHistory()

          await windowManager.showExtensionWindow()

          // Existing extension window gets brought to front
          expect(chrome.windows.update.notCalled).toBe(true)
        })

        describe('with pre-existing extension window(s)', () => {

          beforeEach(async () => {
            await windowManager.createExtensionWindow(tabId, config)

            chrome.windows.create.resetHistory()
            chrome.windows.update.resetHistory()
            chrome.tabs.get.resetHistory()
          })

          it('comes to front & is focused if user clicks button 2nd time', async () => {
            // 2nd user click simply brings extension window to the front and gives it focus
            const extensionWindow2ndClick = await windowManager.showExtensionWindow()

            expect(extensionWindow2ndClick).toBe(null)
            expect(chrome.windows.create.notCalled).toBe(true)

            // called once for each open tab
            expect(chrome.tabs.get.calledTwice).toBe(true)

            // Pre-existing extension window gets focused
            expect(chrome.windows.update.calledTwice).toBe(true)
            expect(chrome.windows.update.calledWith(windowId, winUpdateArgs)).toBe(true)
          })

          it('windows are cascaded when brought to front', async () => {
            // 2nd user click simply brings extension window to the front and gives it focus
            await windowManager.showExtensionWindow()

            expect(chrome.windows.update.calledTwice).toBe(true)
            expect(chrome.windows.update.getCall(1).args[1].left)
              .toBe(chrome.windows.update.getCall(0).args[1].left + WINDOW_CASCADE_OFFSET)
            expect(chrome.windows.update.getCall(1).args[1].top)
              .toBe(chrome.windows.update.getCall(0).args[1].top + WINDOW_CASCADE_OFFSET)
          })
        })
      })
    })
  })

  describe('dappHasWindowOpen', () => {
    it('returns true if a window is already open for the dapp', async () => {
      await windowManager.createExtensionWindow(tabId, config)
      expect(windowManager.dappHasWindowOpen(tabId)).toBe(true)
    })

    it('returns false if no windows are open for the dapp', () => {
      expect(windowManager.dappHasWindowOpen(tabId)).toBe(false)
    })
  })

  describe('closeCurrentWindow', () => {
    describe('when there is no delay set', () => {
      it('closes the window immediately', () => {
        windowManager.closeCurrentWindow()
        jest.runTimersToTime(0)
        expect(window.close).toHaveBeenCalled()
      })
    })

    describe('when there is a delay set', () => {
      it('closes the window after a delay', () => {
        windowManager.closeCurrentWindow(1500)
        expect(window.close).not.toHaveBeenCalled()
        jest.runTimersToTime(1500)
        expect(window.close).toHaveBeenCalled()
      })
    })
  })

  describe('setCurrentWindowOnBeforeUnload', () => {
    it('sets the window beforeunload callback', () => {
      window.addEventListener = jest.fn((eventName, callback) => {
        if (eventName === 'beforeunload') {
          callback()
        }
      })

      const testCallback = jest.fn()
      windowManager.addCurrentWindowBeforeUnloadListener(testCallback)

      expect(testCallback)
    })
  })

  describe('singleton', () => {
    const getDefaultWindowManager = WindowManagerImport.default
    let WindowManager: jest.Mock
    beforeEach(() => {
      WindowManager = jest.fn()
      jest.spyOn(WindowManagerImport, 'WindowManager').mockImplementation(WindowManager)
    })

    it('uses the same windowManager for multiple calls', () => {
      const windowManager1 = getDefaultWindowManager()
      const windowManager2 = getDefaultWindowManager()
      expect(windowManager1).toBe(windowManager2)
    })
  })
})
