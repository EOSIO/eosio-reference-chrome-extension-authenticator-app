import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import AuthDetailsView from 'components/auth/AuthDetails/AuthDetailsView'
import AuthDetailsForm from 'components/auth/AuthDetailsForm/AuthDetailsForm'
import NavBar from 'components/navigation/NavBar'

describe('AuthDetailsView', () => {
  let authDetailsView: ShallowWrapper
  const auth = {
    publicKey: 'publicKey',
    encryptedPrivateKey: 'encryptedPrivateKey',
    nickname: 'My Account Nickname',
  }
  let onAuthUpdate: jest.Mock
  let onAuthRemove: jest.Mock

  beforeEach(() => {
    onAuthUpdate = jest.fn()
    onAuthRemove = jest.fn()

    authDetailsView = shallow(
      <AuthDetailsView
        auth={auth}
        auths={[auth]}
        onAuthUpdate={onAuthUpdate}
        onAuthRemove={onAuthRemove}
      />,
    )
  })

  describe('the Delete Auth button', () => {
    const event: any = {}
    it('deletes this auth from the redux store', () => {
      authDetailsView.find('#deleteAuth').prop('onClick')(event)
      expect(onAuthRemove).toHaveBeenCalledTimes(1)
    })
  })

  describe('rendering', () => {
    it('renders the nav bar', () => {
      expect(authDetailsView.find(NavBar).length).toEqual(1)
    })

    it('renders the auth details form', () => {
      expect(authDetailsView.find(AuthDetailsForm).props()).toEqual({
        currentAuth: auth,
        auths: [auth],
        onAuthUpdate,
      })
    })
  })
})
