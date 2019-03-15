import * as insecureModeStorageMocks from 'utils/storage/__mocks__/InsecureModeStorage.mock'
import global from '__mocks__/global.mock'

import * as actions from 'store/insecureMode/insecureModeActions'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'

describe('InsecureMode Actions', () => {
  let dispatch: jest.Mock
  let getState: jest.Mock
  let insecureMode: InsecureMode

  beforeEach(() => {
    jest.clearAllMocks()

    insecureMode = {
      enabled: false,
      whitelist: ['https://www.url1.com'],
    }

    dispatch = jest.fn()
    getState = jest.fn().mockReturnValue({
      insecureMode: {
        loading: false,
        error: undefined,
        data: insecureMode,
      },
    })

    global.URL.mockImplementation(() => ({ origin: 'https://www.url2.com'}))
    insecureModeStorageMocks.get.mockReturnValue(insecureMode)
    insecureModeStorageMocks.set.mockReturnValue(null)
  })

  describe('insecureModeFetch', () => {
    it('starts insecureMode fetch', async () => {
      await actions.insecureModeFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.start())
    })

    it('succeeds with fetched insecureMode', async () => {
      await actions.insecureModeFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success(insecureMode))
    })

    it('dispatches error on storage error', async () => {
      const error = new Error()
      insecureModeStorageMocks.get.mockRejectedValue(error)
      await actions.insecureModeFetch()(dispatch)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.insecureModeModifyAsync.success(insecureMode))
    })
  })

  describe('insecureModeEnabled', () => {
    it('starts insecureMode enable', async () => {
      await actions.insecureModeEnabled(true)(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.start())
    })

    it('succeeds with updated insecure mode', async () => {
      await actions.insecureModeEnabled(true)(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: true,
        whitelist: ['https://www.url1.com'],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: true,
        whitelist: ['https://www.url1.com'],
      }))
    })

    it('dispatches error on storage error', async () => {
      const error = new Error()
      insecureModeStorageMocks.set.mockRejectedValue(error)
      await actions.insecureModeEnabled(true)(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.insecureModeModifyAsync.success())
    })
  })

  describe('insecureModeWhitelistAdd', () => {
    it('dispatches insecureMode async modification start action', async () => {
      await actions.insecureModeWhitelistAdd('https://www.url2.com')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.start())
    })

    it('only stores the origin of the URL in the whitelist', async () => {
      await actions.insecureModeWhitelistAdd('https://www.url2.com/shouldGetCut/off')(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: false,
        whitelist: ['https://www.url1.com', 'https://www.url2.com'],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: false,
        whitelist: ['https://www.url1.com', 'https://www.url2.com'],
      }))
    })

    it('succeeds with added whitelist URL if there is already something in the whitelist', async () => {
      await actions.insecureModeWhitelistAdd('https://www.url2.com')(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: false,
        whitelist: ['https://www.url1.com', 'https://www.url2.com'],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: false,
        whitelist: ['https://www.url1.com', 'https://www.url2.com'],
      }))
    })

    it('succeeds with added whitelist URL if there is not already a whitelist', async () => {
      getState.mockReturnValue({
        insecureMode: {
          data: {
            enabled: false,
          },
        },
      })

      await actions.insecureModeWhitelistAdd('https://www.url2.com')(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: false,
        whitelist: ['https://www.url2.com'],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: false,
        whitelist: ['https://www.url2.com'],
      }))
    })

    it('fails on duplicate URL additions', async () => {
      const expectedError = new Error('URL already exists in whitelist')
      getState.mockReturnValue({
        insecureMode: {
          data: {
            enabled: false,
            whitelist: ['https://www.url2.com'],
          },
        },
      })

      await actions.insecureModeWhitelistAdd('https://www.url2.com/shouldGetCut/off')(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.error(expectedError))
    })

    it('fails without protocol specified', async () => {
      const expectedError = new Error('Invalid URL: no protocol specified')

      await actions.insecureModeWhitelistAdd('www.url2.com')(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.error(expectedError))
    })

    it('dispatches error on storage error', async () => {
      const error = new Error()
      insecureModeStorageMocks.set.mockRejectedValue(error)
      await actions.insecureModeWhitelistAdd('https://www.url2.com')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.insecureModeModifyAsync.success())
    })
  })

  describe('insecureModeWhitelistDelete', () => {
    it('dispatches insecureMode async modification start action', async () => {
      await actions.insecureModeWhitelistDelete('https://www.url2.com')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.start())
    })

    it('succeeds with deleted whitelisted URL if it is found in the whitelist', async () => {
      await actions.insecureModeWhitelistDelete('https://www.url1.com')(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: false,
        whitelist: [],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: false,
        whitelist: [],
      }))
    })

    it('succeeds with an empty whitelist if the whitelist is already empty', async () => {
      getState.mockReturnValue({
        insecureMode: {
          data: {
            enabled: false,
          },
        },
      })

      await actions.insecureModeWhitelistDelete('https://www.url2.com')(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: false,
        whitelist: [],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: false,
        whitelist: [],
      }))
    })

    it('succeeds with an unmodified whitelist if URL is not found in the whitelist', async () => {
      await actions.insecureModeWhitelistDelete('https://www.url2.com')(dispatch, getState)

      expect(insecureModeStorageMocks.set).toHaveBeenCalledWith({
        enabled: false,
        whitelist: ['https://www.url1.com'],
      })

      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.success({
        enabled: false,
        whitelist: ['https://www.url1.com'],
      }))
    })

    it('dispatches error on storage error', async () => {
      const error = new Error()
      insecureModeStorageMocks.set.mockRejectedValue(error)
      await actions.insecureModeWhitelistDelete('https://www.url2.com')(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(actions.insecureModeModifyAsync.error(error))
      expect(dispatch).not.toHaveBeenCalledWith(actions.insecureModeModifyAsync.success())
    })
  })
})
