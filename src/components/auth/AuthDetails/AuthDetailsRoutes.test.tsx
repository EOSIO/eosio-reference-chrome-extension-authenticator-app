import * as React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { AuthDetailsRoutes } from './AuthDetailsRoutes'
import * as AuthDetailsViewImport from 'components/auth/AuthDetails/AuthDetailsView'
import * as ConfirmPassphraseContainerImport from 'components/passphrase/confirmPassphrase/ConfirmPassphraseContainer'
import Auth from 'utils/Auth'
import RoutePath from 'constants/routePath'

describe('AuthDetailsRoutes', () => {
  let router: ReactWrapper

  let AuthDetailsView: any
  let ConfirmPassphraseContainer: any

  let auths: Auth[]
  let auth: Auth
  let location: any

  let onAuthUpdate: jest.Mock
  let onAuthRemove: jest.Mock
  let onConfirmPassphrase: jest.Mock
  let onFailPassphrase: jest.Mock

  beforeEach(() => {
    AuthDetailsView = <div id='AuthDetailsView' />
    jest.spyOn(AuthDetailsViewImport, 'default').mockImplementation(
      jest.fn(() => AuthDetailsView),
    )

    ConfirmPassphraseContainer = <div id='ConfirmPassphraseContainer' />
    jest.spyOn(ConfirmPassphraseContainerImport, 'default').mockImplementation(
      jest.fn(() => ConfirmPassphraseContainer),
    )

    auths = [
      {
        nickname: 'nickname1',
        publicKey: 'publicKey1',
        encryptedPrivateKey: 'encryptedPrivateKey1',
      },
      {
        nickname: 'nickname2',
        publicKey: 'publicKey2',
        encryptedPrivateKey: 'encryptedPrivateKey2',
      }
    ]
    auth = auths[0]
    location = {}

    onAuthUpdate = jest.fn()
    onAuthRemove = jest.fn()
    onConfirmPassphrase = jest.fn()
    onFailPassphrase = jest.fn()
  })

  describe('rendering', () => {
    describe(`when the path is: ${RoutePath.AUTH_DETAILS_VIEW}`, () => {
      beforeEach(() => {
        location.pathname = RoutePath.AUTH_DETAILS_VIEW,

        router = mount(
          <Router>
            <AuthDetailsRoutes
              auth={auth}
              auths={auths}
              onAuthRemove={onAuthRemove}
              onAuthUpdate={onAuthUpdate}
              onConfirmPassphrase={onConfirmPassphrase}
              onFailPassphrase={onFailPassphrase}
              location={location}
              history={null}
              match={null}
            />
          </Router>,
        )
      })

      it('renders the auth details page', () => {
        expect(router.find('#AuthDetailsView')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.AUTH_DETAILS_CONFIRM_PASSPHRASE}`, () => {
      beforeEach(() => {
        location.pathname = RoutePath.AUTH_DETAILS_CONFIRM_PASSPHRASE

        router = mount(
          <Router>
            <AuthDetailsRoutes
              auth={auth}
              auths={auths}
              onAuthRemove={onAuthRemove}
              onAuthUpdate={onAuthUpdate}
              onConfirmPassphrase={onConfirmPassphrase}
              onFailPassphrase={onFailPassphrase}
              location={location}
              history={null}
              match={null}
            />
          </Router>,
        )
      })

      it('renders the confirm passphrase page', () => {
        expect(router.find('#ConfirmPassphraseContainer')).toHaveLength(1)
      })
    })
  })
})
