import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'
import * as dappMessengerMocks from 'utils/__mocks__/DappMessenger.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import { AuthDetailsContainer, mapDispatchToProps } from 'components/auth/AuthDetails/AuthDetailsContainer'
import AuthDetailsRoutes from 'components/auth/AuthDetails/AuthDetailsRoutes'
import * as authActions from 'store/auths/authsActions'
import Auth from 'utils/Auth'
import RoutePath from 'constants/routePath'

describe('AuthDetailsContainer', () => {
  let authDetailsContainer: ShallowWrapper
  let location: any
  let history: any
  let request: any
  let dispatch: jest.Mock
  let onAuthUpdate: jest.Mock
  let onAuthRemove: jest.Mock
  const auths: Auth[] = [{
    nickname: 'test Acct Nickname',
    encryptedPrivateKey: 'nfafhaweicunafwekcn20pdjqu2pdjrpqjd',
    publicKey: 'kd-2ke-8252ei98309ei029ei-2',
  }]
  const auth = auths[0]

  beforeEach(() => {
    location = {}

    history = {
      push: jest.fn(),
      goBack: jest.fn(),
      go: jest.fn(),
    }

    request = {
      requestId: 'requestId',
      action: 'action',
    }

    dispatch = jest.fn()
    onAuthUpdate = jest.fn()
    onAuthRemove = jest.fn()

    dappMessengerMocks.sendMessage.mockReset()

    authDetailsContainer = shallow(
      <AuthDetailsContainer
        request={request}
        auths={auths}
        publicKey={auths[0].publicKey}
        onAuthUpdate={onAuthUpdate}
        onAuthRemove={onAuthRemove}
        history={history}
        location={location}
        match={null}
      />,
    )
  })

  describe('when the user wants to delete the auth', () => {
    beforeEach(() => {
      authDetailsContainer.find(AuthDetailsRoutes).prop('onAuthRemove')(auth.nickname)
    })

    it('navigates to the confirm passphrase page', () => {
      expect(history.push).toHaveBeenCalledWith(`${RoutePath.AUTH_DETAILS}/${auth.publicKey}/confirmPassphrase`)
    })
  })

  describe('when the user confirms their passphrase for deleting an auth', () => {
    beforeEach(() => {
      authDetailsContainer.find(AuthDetailsRoutes).prop('onConfirmPassphrase')()
    })

    it('calls the auth remove callback', () => {
      expect(onAuthRemove).toHaveBeenCalledWith(auth.publicKey)
    })

    it('navigates to the authorizers page', () => {
      expect(history.go).toHaveBeenCalledWith(-2)
    })
  })

  describe('when the user fails at deleting the auth', () => {
    beforeEach(() => {
      authDetailsContainer.find(AuthDetailsRoutes).prop('onFailPassphrase')()
    })

    it('navigates to the confirm passphrase page', () => {
      expect(history.goBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('user updates account nickname', () => {
    const newNickname = 'new acct name'
    beforeEach(() => {
      authDetailsContainer.find(AuthDetailsRoutes).prop('onAuthUpdate')(auth.nickname, newNickname)
    })

    it('calls the auth update callback', () => {
      expect(onAuthUpdate).toHaveBeenCalledWith(auth.nickname, newNickname)
    })
  })

  describe('rendering', () => {
    it('renders the AuthDetailsRoutes', () => {
      /* tslint:disable:no-string-literal */
      expect(authDetailsContainer.find(AuthDetailsRoutes).props()).toEqual({
        auth,
        auths: [auth],
        onAuthRemove: authDetailsContainer.instance()['onAuthRemove'],
        onAuthUpdate: authDetailsContainer.prop('onAuthUpdate'),
        onConfirmPassphrase: authDetailsContainer.instance()['onConfirmPassphrase'],
        onFailPassphrase: authDetailsContainer.instance()['onFailPassphrase'],
      })
      /* tslint:enable:no-string-literal */
    })
  })

  it('maps authUpdate prop to authUpdate action', () => {
    const newNickname = 'new acct name'
    const { onAuthUpdate: dispatchAuthUpdate } = mapDispatchToProps(dispatch)

    jest.spyOn(authActions, 'authUpdate').mockReturnValue('auth update action')

    dispatchAuthUpdate(newNickname, 'accountName')
    expect(dispatch).toHaveBeenCalledWith('auth update action')
  })

  it('maps onAuthRemove prop to authDelayedRemove action', () => {
    const { onAuthRemove: dispatchAuthRemove } = mapDispatchToProps(dispatch)

    jest.spyOn(authActions, 'authDelayedRemove').mockReturnValue('auth remove action')

    dispatchAuthRemove('accountName')
    expect(dispatch).toHaveBeenCalledWith('auth remove action')
  })
})
