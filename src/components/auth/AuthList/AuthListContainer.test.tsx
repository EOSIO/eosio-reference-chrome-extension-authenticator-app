import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import { AuthListContainer, mapStateToProps, mapDispatchToProps } from './AuthListContainer'
import * as authActions from 'store/auths/authsActions'
import AuthListView from './AuthListView'
import Auth from 'utils/Auth'
import RoutePath from 'constants/routePath'
import { DelayedRemovable } from 'store/AppState'

describe('AuthListContainer', () => {
  let authListContainer: ShallowWrapper
  let auths: Array<DelayedRemovable<Auth>>
  let onAuthRemoveUndo: jest.Mock
  let history: any
  let dispatch: jest.Mock

  beforeEach(() => {
    auths = [{
      encryptedPrivateKey: 'encryptedPrivateKey',
      publicKey: 'publicKey',
      nickname: 'name',
      removing: false,
    }, {
      encryptedPrivateKey: 'encryptedPrivateKey2',
      publicKey: 'publicKey2',
      nickname: 'name2',
      removing: false,
    }]

    history = {
      push: jest.fn(),
    }

    dispatch = jest.fn()

    onAuthRemoveUndo = jest.fn()

    authListContainer = shallow(
      <AuthListContainer
        history={history}
        loading
        auths={auths}
        onAuthRemoveUndo={onAuthRemoveUndo}
        location={null}
        match={null}
      />,
    )
  })

  describe('rendering', () => {
    it('renders the auth list', () => {
      /* tslint:disable:no-string-literal */
      expect(authListContainer.find(AuthListView).props()).toEqual({
        loading: true,
        auths,
        onAddAuth: authListContainer.instance()['onAddAuth'],
        onAuthRemoveUndo: authListContainer.prop('onAuthRemoveUndo'),
      })
      /* tslint:enable:no-string-literal */
    })
  })

  describe('onAddAuth', () => {
    it('navigates to add auth page', () => {
      /* tslint:disable-next-line:no-string-literal */
      authListContainer.instance()['onAddAuth']()

      expect(history.push).toHaveBeenCalledWith(RoutePath.ADD_AUTH)
    })
  })

  describe('mapStateToProps', () => {
    let mappedProps: any

    beforeEach(() => {
      const state = {
        auths: {
          data: 'auths',
          loading: true,
        },
      }

      mappedProps = mapStateToProps(state as any)
    })

    it('gets auths from the redux state', () => {
      expect(mappedProps.auths).toEqual('auths')
    })

    it('gets loading from the redux state', () => {
      expect(mappedProps.loading).toEqual(true)
    })
  })

  describe('mapDispatchToProps', () => {
    let mappedProps: any

    beforeEach(() => {
      mappedProps = mapDispatchToProps(dispatch)
    })

    it('maps onAuthRemoveUndo prop to authDelayedRemoveUndo action', () => {
      jest.spyOn(authActions, 'authDelayedRemoveUndo').mockReturnValue('auth remove undo action')

      mappedProps.onAuthRemoveUndo('publicKey')
      expect(dispatch).toHaveBeenCalledWith('auth remove undo action')
    })
  })
})
