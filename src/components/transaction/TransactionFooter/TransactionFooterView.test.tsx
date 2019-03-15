import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import FooterView from 'components/shared/layout/FooterView'
import TransactionFooterView from './TransactionFooterView'

describe('TransactionFooterView', () => {
  let transactionFooterView: ShallowWrapper
  let rejectTransaction: () => void
  let signTransaction: () => void

  beforeEach(() => {
    rejectTransaction = jest.fn()
    signTransaction = jest.fn()

    transactionFooterView = shallow(
      <TransactionFooterView
        chainInfo={manifestData.appMetadata.chains[0]}
        actor='thegazelle'
        canAccept={false}
        onTransactionSign={signTransaction}
        onTransactionCancel={rejectTransaction}
      />,
    )
  })

  it('renders FooterView', () => {
    expect(transactionFooterView.find(FooterView)).toHaveLength(1)
  })

  it('renders the chain icon from chainInfo', () => {
    expect(transactionFooterView.find('.chain-icon').prop('src')).toBe(manifestData.appMetadata.chains[0].icon)
  })

  it('renders the chain name based on the chain info', () => {
    expect(transactionFooterView.find('.chain-name').text())
      .toContain(`${manifestData.appMetadata.chains[0].chainName}`)
  })
})
