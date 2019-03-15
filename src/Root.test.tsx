import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { Root, mapDispatchToProps, mapStateToProps } from 'Root'
import AppContainer from 'AppContainer'
import LoadingOverlay from 'components/shared/LoadingOverlay'
import SettingsView from 'components/settings/SettingsView'
import * as globalActions from 'store/global/globalActions'
import * as storeListeners from 'store/storeListeners'
import RoutePath from 'constants/routePath'

declare var global: any

describe('Root', () => {
  let root: ShallowWrapper
  let state: any
  let dispatch: jest.Mock
  let globalLoad: jest.Mock
  let fakePassphraseHash: string

  beforeEach(() => {
    dispatch = jest.fn()
    globalLoad = jest.fn()
    fakePassphraseHash = 'fake passphrase hash'

    state = {
      global: {
        loading: true,
      },
      passphraseHash: {
        data: fakePassphraseHash,
      },
    }
  })

  describe('on component did mount', () => {
    let startStoreListenersSpy: jest.SpyInstance

    beforeEach(async () => {
      root = shallow(
        <Root
          isLoading
          globalLoad={globalLoad}
          passphraseHash={fakePassphraseHash}
        />,
      { disableLifecycleMethods: true })

      startStoreListenersSpy = jest.spyOn(storeListeners, 'startStoreListeners')

      await root.instance().componentDidMount()
    })

    it('loads the app', () => {
      expect(globalLoad).toHaveBeenCalled()
    })

    it('starts store listeners', async () => {
      expect(startStoreListenersSpy).toHaveBeenCalled()
    })
  })

  describe('on component will unmount', () => {
    let stopStoreListenersSpy: jest.SpyInstance

    beforeEach(() => {
      root = shallow(
        <Root
          isLoading
          globalLoad={globalLoad}
          passphraseHash={fakePassphraseHash}
        />,
      { disableLifecycleMethods: true })

      stopStoreListenersSpy = jest.spyOn(storeListeners, 'stopStoreListeners')

      root.instance().componentWillUnmount()
    })

    it('stops store listeners', () => {
      expect(stopStoreListenersSpy).toHaveBeenCalled()
    })
  })

  describe('if the app is loading', () => {
    beforeEach(() => {
      root = shallow(
        <Root
          isLoading
          globalLoad={globalLoad}
          passphraseHash={fakePassphraseHash}
        />,
      )
    })

    it('renders the Router', () => {
      expect(root.find(Router)).toHaveLength(1)
    })

    it('renders the loading overlay', () => {
      expect(root.find(LoadingOverlay)).toHaveLength(1)
    })
  })

  describe('if the app is not loading', () => {
    beforeEach(() => {
      root = shallow(
        <Root
          isLoading={false}
          globalLoad={globalLoad}
          passphraseHash={fakePassphraseHash}
        />,
      )
    })

    it('renders the Router', () => {
      expect(root.find(Router)).toHaveLength(1)
    })

    it('renders the App', () => {
      expect(root.find(AppContainer)).toHaveLength(1)
    })
  })

  it('gets the isLoading prop from the redux state', () => {
    expect(mapStateToProps(state as any).isLoading).toEqual(true)
  })

  it('gets the passphraseHash prop from the redux state', () => {
    expect(mapStateToProps(state as any).passphraseHash).toEqual(fakePassphraseHash)
  })

  it('maps globaLoad prop to globalLoad action', () => {
    const { globalLoad: dispatchGlobalLoad } = mapDispatchToProps(dispatch)

    jest.spyOn(globalActions, 'globalLoad').mockReturnValue('global load action')

    dispatchGlobalLoad()
    expect(dispatch).toHaveBeenCalledWith('global load action')
  })

  describe('if the user opens the settings page', () => {
    beforeEach(() => {
      global.window.location.hash = '#options'
      root = shallow(
        <Root
          isLoading={false}
          globalLoad={globalLoad}
          passphraseHash={fakePassphraseHash}
        />,
      )
    })

    it('renders the Router with the Developer path as the initial entry', () => {
      expect(root.find(Router).prop('initialEntries')).toEqual([RoutePath.GENERAL_SETTINGS])
    })

    it('renders the SettingsView', () => {
      expect(root.find(SettingsView)).toHaveLength(1)
    })
  })
})
