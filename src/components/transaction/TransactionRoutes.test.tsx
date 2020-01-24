import '__mocks__/chrome.mock'
import * as data from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as React from 'react'
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Location } from 'history'
import store from 'store/store'

import { TransactionRoutes } from './TransactionRoutes'
import TXStatus from 'constants/txStatus'
import RoutePath from 'constants/routePath'

jest.mock('components/passphrase/confirmPassphrase/confirmPassphraseContainer', () => () => <div id='ConfirmPassphraseContainer' />)
jest.mock('components/transactionStatus/TransactionStatusContainer', () => () => <div id='TransactionStatusContainer' />)
jest.mock('components/transaction/TransactionView/TransactionView', () => () => <div id='TransactionView' />)

describe('TransactionRoutes', () => {
  let router: ReactWrapper

  let transactionView: ShallowWrapper
  let onTransactionSign: jest.Mock
  let onTransactionCancel: jest.Mock
  let onTransactionError: jest.Mock
  let onSetCanAccept: jest.Mock
  let onConfirmPassphrase: jest.Mock
  let onFailPassphrase: jest.Mock
  let push: jest.Mock
  let pop: jest.Mock
  let replace: jest.Mock
  let navigation: any
  let defaultData: any
  let location: Location

  beforeEach(() => {
    onTransactionSign = jest.fn()
    onTransactionCancel = jest.fn()
    onTransactionError = jest.fn()
    onSetCanAccept = jest.fn()
    onConfirmPassphrase = jest.fn()
    onFailPassphrase = jest.fn()

    push = jest.fn()
    pop = jest.fn()
    replace = jest.fn()

    navigation = {
      push,
      pop,
      replace,
    }

    location = {} as Location

    defaultData = {
      canAccept: true,
      chainInfo: manifestData.appMetadata.chains[0],
      appRoot: 'test.com',
      appMetadata: manifestData.appMetadata,
      transactionInfo: data.transactionWithSingleAction,
      txStatus: TXStatus.PENDING,
      allowUnusedContractVariables: true,
      abis: data.abis,
      actor: 'thegazelle',
      onTransactionSign,
      onTransactionCancel,
      onTransactionError,
      onSetCanAccept,
      onConfirmPassphrase,
      onFailPassphrase,
      navigation,
      location,
    }
  })

  describe('rendering', () => {
    describe('if there is no missing data', () => {

      describe(`when the path is: ${RoutePath.TRANSACTION_APPROVED}`, () => {
        beforeEach(() => {
          location.pathname = RoutePath.TRANSACTION_APPROVED

          router = mount(
            <Router>
              <TransactionRoutes {...defaultData} />
            </Router>,
          )
        })

        it('renders the approved transaction status page', () => {
          expect(router.find('#TransactionStatusContainer')).toHaveLength(1)
        })
      })

      describe(`when the path is: ${RoutePath.TRANSACTION_CANCELLED}`, () => {
        beforeEach(() => {
          location.pathname = RoutePath.TRANSACTION_CANCELLED

          router = mount(
            <Router>
              <TransactionRoutes {...defaultData} />
            </Router>,
          )
        })

        it('renders the cancelled transaction status page', () => {
          expect(router.find('#TransactionStatusContainer')).toHaveLength(1)
        })
      })

      describe(`when the path is ${RoutePath.TRANSACTION_CONFIRM_PASSPHRASE}`, () => {
        beforeEach(() => {
          location.pathname = RoutePath.TRANSACTION_CONFIRM_PASSPHRASE

          router = mount(
            <Provider store={store}>
              <Router>
                <TransactionRoutes {...defaultData} />
              </Router>
            </Provider>,
          )
        })

        it('renders the confirm passphrase page', () => {
          expect(router.find('#ConfirmPassphraseContainer')).toHaveLength(1)
        })
      })

      describe(`when the path is ${RoutePath.TRANSACTION_RICARDIAN}`, () => {
        beforeEach(() => {
          location.pathname = RoutePath.TRANSACTION_RICARDIAN

          router = mount(
            <Router>
              <TransactionRoutes {...defaultData} />
            </Router>,
          )
        })

        it('renders the transaction ricardian view', () => {
          expect(router.find('#TransactionView')).toHaveLength(1)
        })
      })
    })

    describe('if there is missing data', () => {
      describe('with no ABIs', () => {
        it('doesn\'t render', () => {
          shallowRenderTransactionRoutes({
            ...defaultData,
            abis: null,
          })

          expect(transactionView.find('div').length).toBe(0)
        })
      })

      describe('with no transaction', () => {
        it('doesn\'t render', () => {
          shallowRenderTransactionRoutes({
            ...defaultData,
            transactionInfo: null,
          })

          expect(transactionView.find('div').length).toBe(0)
        })
      })

      describe('with no transaction actions', () => {
        it('doesn\'t render', () => {
          shallowRenderTransactionRoutes({
            ...defaultData,
            transactionInfo: {
              actions: null,
            },
          })
          expect(transactionView.find('div').length).toBe(0)
        })
      })
    })
  })

  const shallowRenderTransactionRoutes = (props: any) => {
    transactionView = shallow(
      <TransactionRoutes
        {...props}
      />,
      {
        disableLifecycleMethods: true,
      }
    )
  }
})
