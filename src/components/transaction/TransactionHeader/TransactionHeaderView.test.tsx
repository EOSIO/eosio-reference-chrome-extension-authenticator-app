import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import TransactionHeaderView from './TransactionHeaderView'

describe('TransactionHeaderView', () => {
  let transactionHeaderView: ShallowWrapper

  beforeEach(() => {
    transactionHeaderView = shallow(
      <TransactionHeaderView
        appRoot='test.com'
        appMetadata={manifestData.appMetadata}
      />,
    )
  })

  describe('rendering', () => {
    it('renders the transaction header', () => {
      expect(transactionHeaderView.find('.transaction-header').length).toBe(1)
    })

    it('renders the app icon from metadata', () => {
      expect(transactionHeaderView.find('.application-icon').prop('src')).toBe(manifestData.appMetadata.icon)
    })

    it('renders the app title from metadata', () => {
      expect(transactionHeaderView.find('.application-title').text()).toBe(manifestData.appMetadata.shortname)
    })

    it('renders the app root', () => {
      expect(transactionHeaderView.find('.application-root').text()).toBe('test.com')
    })
  })
})
