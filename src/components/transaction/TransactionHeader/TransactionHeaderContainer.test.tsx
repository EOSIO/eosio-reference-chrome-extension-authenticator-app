import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import { TransactionHeaderContainer, mapStateToProps } from './TransactionHeaderContainer'
import TransactionHeaderView from './TransactionHeaderView'
import { DappInfo } from 'utils/manifest/DappInfo'

describe('TransactionHeaderContainer', () => {
  let transactionHeaderContainer: ShallowWrapper
  let dappInfo: DappInfo

  beforeEach(() => {
    dappInfo = manifestData.dappInfo
  })

  describe('when rendered', () => {
    beforeEach(() => {
      shallowRenderTransactionHeaderContainer()
    })

    it('renders the transaction header', () => {
      const appRoot = manifestData.dappInfo.rootUrl
      const appMetadata = manifestData.dappInfo.appMetadataInfo.appMetadata

      expect(transactionHeaderContainer.find(TransactionHeaderView).props()).toEqual({
        appRoot,
        appMetadata,
      })
    })

    it('gets the dappInfo from the redux state', () => {
      const state = {
        dappInfo: {
          data: dappInfo,
        },
      }

      expect(mapStateToProps(state as any).dappInfo).toEqual(dappInfo)
    })
  })

  const shallowRenderTransactionHeaderContainer = () => {
    transactionHeaderContainer = shallow(
      <TransactionHeaderContainer
        dappInfo={dappInfo}
      />,
      {
        disableLifecycleMethods: true,
      }
    )
  }
})
