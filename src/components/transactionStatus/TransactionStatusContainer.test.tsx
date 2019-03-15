import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import TransactionStatusContainer,
  { APPROVED_DETAILS, CANCELLED_DETAILS } from 'components/transactionStatus/TransactionStatusContainer'
import TransactionStatusView from 'components/transactionStatus/TransactionStatusView'
import TXStatus from 'constants/txStatus'

describe('TransactionStatusContainer', () => {
  let transactionStatusContainer: ShallowWrapper

  describe('approved transaction', () => {
    beforeEach(() => {
      transactionStatusContainer = shallow(
        <TransactionStatusContainer status={TXStatus.SIGNED} />,
      )
    })

    it('should render transaction status view with approved details', () => {
      expect(transactionStatusContainer.find(TransactionStatusView).props()).toEqual({
        title: APPROVED_DETAILS.TITLE,
        body: APPROVED_DETAILS.BODY,
        icon: APPROVED_DETAILS.ICON,
      })
    })
  })

  describe('cancelled transaction', () => {
    beforeEach(() => {
      transactionStatusContainer = shallow(
        <TransactionStatusContainer status={TXStatus.CANCELLED} />,
      )
    })

    it('should render the transaction status view with cancelled details', () => {
      expect(transactionStatusContainer.find(TransactionStatusView).props()).toEqual({
        title: CANCELLED_DETAILS.TITLE,
        body: CANCELLED_DETAILS.BODY,
        icon: CANCELLED_DETAILS.ICON,
      })
    })
  })
})
