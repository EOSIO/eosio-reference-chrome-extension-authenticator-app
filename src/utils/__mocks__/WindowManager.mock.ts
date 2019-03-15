import * as WindowManagerImport from 'utils/WindowManager'

export const createExtensionWindow = jest.fn()
export const dappHasWindowOpen = jest.fn()
export const closeCurrentWindow = jest.fn()
export const showExtensionWindow = jest.fn()
export const setCurrentWindowOnBeforeUnload = jest.fn()

export const windowManagerMock = {
  createExtensionWindow,
  dappHasWindowOpen,
  closeCurrentWindow,
  showExtensionWindow,
  setCurrentWindowOnBeforeUnload,
}

jest.spyOn(WindowManagerImport, 'WindowManager').mockImplementation(() => windowManagerMock)
jest.spyOn(WindowManagerImport, 'default').mockImplementation(() => windowManagerMock)
