import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import App from './App'
import * as AuthListContainerImport from 'components/auth/AuthList/AuthListContainer'
import * as AddAuthContainerImport from 'components/auth/AddAuth/AddAuthContainer'
import * as AuthDetailsContainerImport from 'components/auth/AuthDetails/AuthDetailsContainer'
import * as SelectiveDisclosureImport from 'components/selectiveDisclosure/SelectiveDisclosureContainer'
import * as TransactionContainerImport from 'components/transaction/TransactionContainer'
import * as ErrorContainerImport from 'components/error/ErrorContainer'
import * as CreatePassphraseContainerImport from 'components/passphrase/createPassphrase/CreatePassphraseContainer'
import RoutePath from 'constants/routePath'

describe('App', () => {
  let router: ReactWrapper

  let AuthListContainer: any
  let AuthDetailsContainer: any
  let ImportContainer: any
  let SelectiveDisclosureContainer: any
  let TransactionContainer: any
  let ErrorContainer: any
  let CreatePassphraseContainer: any
  const testPublicKey: string = 'testPublicKey'

  beforeEach(() => {
    AuthListContainer = <div id='AuthListContainer' />
    jest.spyOn(AuthListContainerImport, 'default').mockImplementation(jest.fn(() => AuthListContainer))

    AuthDetailsContainer = <div id='AuthDetailsContainer' />
    jest.spyOn(AuthDetailsContainerImport, 'default').mockImplementation(jest.fn(() => AuthDetailsContainer))

    ImportContainer = <div id='ImportContainer' />
    jest.spyOn(AddAuthContainerImport, 'default').mockImplementation(jest.fn(() => ImportContainer))

    SelectiveDisclosureContainer = <div id='SelectiveDisclosureContainer' />
    jest.spyOn(SelectiveDisclosureImport, 'default').mockImplementation(jest.fn(() => SelectiveDisclosureContainer))

    TransactionContainer = <div id='TransactionContainer' />
    jest.spyOn(TransactionContainerImport, 'default').mockImplementation(jest.fn(() => TransactionContainer))

    ErrorContainer = <div id='ErrorContainer' />
    jest.spyOn(ErrorContainerImport, 'default').mockImplementation(jest.fn(() => ErrorContainer))

    CreatePassphraseContainer = <div id='CreatePassphraseContainer' />
    jest.spyOn(CreatePassphraseContainerImport, 'default').mockImplementation(jest.fn(() => CreatePassphraseContainer))
  })

  describe('rendering', () => {
    describe(`when the path is: ${RoutePath.AUTHS}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.AUTHS]}>
            <App />
          </Router>,
        )
      })

      it('renders the Auths screen', () => {
        expect(router.find('#AuthListContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.ADD_AUTH}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.ADD_AUTH]}>
            <App />
          </Router>,
        )
      })

      it('renders the Import screen', () => {
        expect(router.find('#ImportContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.AUTH_DETAILS}/${testPublicKey}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[`${RoutePath.AUTH_DETAILS}/${testPublicKey}`]}>
            <App />
          </Router>,
        )
      })

      it('renders the Auth Details screen', () => {
        expect(router.find('#AuthDetailsContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.SELECTIVE_DISCLOSURE}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.SELECTIVE_DISCLOSURE]}>
            <App />
          </Router>,
        )
      })

      it('renders the Selective Disclosure screen', () => {
        expect(router.find('#SelectiveDisclosureContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.TRANSACTION}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.TRANSACTION]}>
            <App />
          </Router>,
        )
      })

      it('renders the Transaction screen', () => {
        expect(router.find('#TransactionContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.ERROR}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.ERROR]}>
            <App />
          </Router>,
        )
      })

      it('renders the Error screen', () => {
        expect(router.find('#ErrorContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.CREATE_PASSPHRASE}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.CREATE_PASSPHRASE]}>
            <App />
          </Router>,
        )
      })

      it('renders the Create Passphrase screen', () => {
        expect(router.find('#CreatePassphraseContainer')).toHaveLength(1)
      })
    })

  })
})
