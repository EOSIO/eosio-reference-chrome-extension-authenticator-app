import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'
import RoutePath from 'constants/routePath'
import store from 'store/store'

jest.mock('components/auth/AuthList/AuthListContainer', () => () => <div id='AuthListContainer' />)
jest.mock('components/auth/AddAuth/AddAuthContainer', () => () => <div id='AddAuthContainer' />)
jest.mock('components/auth/AuthDetails/AuthDetailsContainer', () => () => <div id='AuthDetailsContainer' />)
jest.mock('components/selectiveDisclosure/SelectiveDisclosureContainer', () => () => <div id='SelectiveDisclosureContainer' />)
jest.mock('components/transaction/TransactionContainer', () => () => <div id='TransactionContainer' />)
jest.mock('components/error/ErrorContainer', () => () => <div id='ErrorContainer' />)
jest.mock('components/passphrase/createPassphrase/CreatePassphraseContainer', () => () => <div id='CreatePassphraseContainer'></div>)

describe('App', () => {
  let router: ReactWrapper
  const testPublicKey: string = 'testPublicKey'

  describe('rendering', () => {
    describe(`when the path is: ${RoutePath.AUTHS}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[RoutePath.AUTHS]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Auths screen', () => {
        expect(router.find('#AuthListContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.ADD_AUTH}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[RoutePath.ADD_AUTH]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Import screen', () => {
        expect(router.find('#AddAuthContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.AUTH_DETAILS}/${testPublicKey}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[`${RoutePath.AUTH_DETAILS}/${testPublicKey}`]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Auth Details screen', () => {
        expect(router.find('#AuthDetailsContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.SELECTIVE_DISCLOSURE}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[RoutePath.SELECTIVE_DISCLOSURE]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Selective Disclosure screen', () => {
        expect(router.find('#SelectiveDisclosureContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.TRANSACTION}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[RoutePath.TRANSACTION]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Transaction screen', () => {
        expect(router.find('#TransactionContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.ERROR}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[RoutePath.ERROR]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Error screen', () => {
        expect(router.find('#ErrorContainer')).toHaveLength(1)
      })
    })

    describe(`when the path is: ${RoutePath.CREATE_PASSPHRASE}`, () => {
      beforeEach(() => {
        router = mount(
          <Provider store={store}>
            <Router initialEntries={[RoutePath.CREATE_PASSPHRASE]}>
              <App />
            </Router>
          </Provider>,
        )
      })

      it('renders the Create Passphrase screen', () => {
        expect(router.find('#CreatePassphraseContainer')).toHaveLength(1)
      })
    })

  })
})
