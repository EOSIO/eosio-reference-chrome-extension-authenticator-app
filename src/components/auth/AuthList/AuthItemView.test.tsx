import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Link } from 'react-router-dom'

import RoutePath from 'constants/routePath'
import AuthItemView from './AuthItemView'
import Auth from 'utils/Auth'

describe('AuthItemView', () => {
  let authItemView: ShallowWrapper
  let auth: Auth

  beforeEach(() => {
    auth = {
      encryptedPrivateKey: 'encryptedPrivateKey1',
      publicKey: 'publicKey1',
      nickname: 'mykey1',
    }

    authItemView = shallow(
      <AuthItemView
        auth={auth}
      />,
    )
  })

  it('should display links to keys with correct routes', () => {
    expect(authItemView.find(Link).prop('to')).toEqual(`${RoutePath.AUTH_DETAILS}/publicKey1`)
  })

  it('should display icons for each key', () => {
    expect(authItemView.find('img.auth-icon').length).toBe(1)
  })

  it('should display more info caret for each key', () => {
    expect(authItemView.find('img.auth-more-info').length).toBe(1)
  })
})
