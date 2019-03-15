import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import TransactionStatusView from 'components/transactionStatus/TransactionStatusView'
import approvedIcon from 'assets/images/approved-icon.svg'

describe('TransactionStatusView', () => {
  let transactionStatusView: ShallowWrapper

  beforeEach(() => {
    transactionStatusView = shallow(
      <TransactionStatusView
        title='Approved'
        body='Transaction has been approved'
        icon={approvedIcon}
      />,
    )
  })

  describe('when rendered', () => {
    it('should render a status icon', () => {
      expect(transactionStatusView.find('img').prop('src')).toBe(approvedIcon)
    })

    it('should render the title text', () => {
      expect(transactionStatusView.find('h1').text()).toBe('Approved')
    })

    it('should render the body text', () => {
      expect(transactionStatusView.find('p').text()).toBe('Transaction has been approved')
    })
  })
})
