import * as data from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import TransactionView from './TransactionView'
import TransactionHeaderContainer from 'components/transaction/TransactionHeader/TransactionHeaderContainer'
import ActionAccordionContainer from 'components/transaction/ActionAccordion/ActionAccordionContainer'
import TransactionFooterContainer from 'components/transaction/TransactionFooter/TransactionFooterContainer'

describe('TransactionView', () => {
  let transactionRicardian: ShallowWrapper
  let onTransactionSign: jest.Mock
  let onTransactionCancel: jest.Mock
  let onTransactionError: jest.Mock
  let onSetCanAccept: jest.Mock
  let defaultData: any

  beforeEach(() => {
    onTransactionSign = jest.fn()
    onTransactionCancel = jest.fn()
    onTransactionError = jest.fn()
    onSetCanAccept = jest.fn()

    defaultData = {
      canAccept: true,
      chainInfo: manifestData.appMetadata.chains[0],
      transactionInfo: data.transactionWithSingleAction,
      allowUnusedContractVariables: true,
      abis: data.abis,
      actor: 'actor1',
      appRoot: 'test.com',
      appMetadata: manifestData.appMetadata,
      onTransactionSign,
      onTransactionCancel,
      onTransactionError,
      onSetCanAccept,
    }
  })

  describe('when rendered', () => {
    beforeEach(() => {
      shallowRenderTransactionView(defaultData)
    })

    it('renders the transaction header', () => {
      expect(transactionRicardian.find(TransactionHeaderContainer)).toHaveLength(1)
    })

    it('renders the action accordion', () => {
      expect(transactionRicardian.find(ActionAccordionContainer).props()).toEqual({
        onTransactionError,
        onSetCanAccept,
      })
    })

    it('renders the footer', () => {
      expect(transactionRicardian.find(TransactionFooterContainer).props()).toEqual({
        canAccept: true,
        onTransactionSign,
        onTransactionCancel,
        onTransactionError,
      })
    })
  })

  const shallowRenderTransactionView = (props: any) => {
    transactionRicardian = shallow(
      <TransactionView
        {...props}
      />,
      {
        disableLifecycleMethods: true,
      }
    )
  }
})
