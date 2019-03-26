import * as data from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { SignatureProviderRequestEnvelope } from 'eosjs-signature-provider-interface'

import { TransactionFooterContainer, mapStateToProps } from './TransactionFooterContainer'
import TransactionFooterView from './TransactionFooterView'
import { DappInfo } from 'utils/manifest/DappInfo'
import { TransactionInfo } from 'eos/Transaction'
import { clone } from 'utils/helpers'

describe('TransactionFooterContainer', () => {
  let transactionFooterContainer: ShallowWrapper
  let dappInfo: DappInfo
  let requestEnvelope: SignatureProviderRequestEnvelope
  let transactionInfo: TransactionInfo
  let canAccept: boolean
  let onTransactionSign: jest.Mock
  let onTransactionCancel: jest.Mock
  let onTransactionError: jest.Mock

  beforeEach(() => {
    dappInfo = clone(manifestData.dappInfo)
    requestEnvelope = clone(data.transactionSignatureRequest)
    transactionInfo = clone(data.transactionWithSingleAction)

    canAccept = true
    onTransactionSign = jest.fn()
    onTransactionCancel = jest.fn()
    onTransactionError = jest.fn()
  })

  describe('when rendered', () => {
    describe('errors', () => {
      describe('no authorization', () => {
        beforeEach(() => {
          transactionInfo.actions[0].authorization[0] = null
          shallowRenderTransactionFooterContainer()
        })

        it('sends an error if there is no authorization', () => {
          expect(onTransactionError).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('no errors', () => {
      beforeEach(() => {
        shallowRenderTransactionFooterContainer()
      })

      it('renders the transaction footer', () => {
        expect(transactionFooterContainer.find(TransactionFooterView).props()).toEqual({
          chainInfo: manifestData.appMetadata.chains[0],
          actor: 'actor1',
          canAccept,
          onTransactionSign,
          onTransactionCancel,
        })
      })
    })
  })

  it('gets the data from the redux state', () => {
    const state = {
      dappInfo: {
        data: dappInfo,
      },
      request: {
        data: { transactionInfo, requestEnvelope },
      },
    }

    expect(mapStateToProps(state as any).dappInfo).toEqual(dappInfo)
    expect(mapStateToProps(state as any).requestEnvelope).toEqual(requestEnvelope)
    expect(mapStateToProps(state as any).transactionInfo).toEqual(transactionInfo)
  })

  const shallowRenderTransactionFooterContainer = () => {
    transactionFooterContainer = shallow(
      <TransactionFooterContainer
        canAccept={canAccept}
        dappInfo={dappInfo}
        requestEnvelope={requestEnvelope}
        transactionInfo={transactionInfo}
        onTransactionSign={onTransactionSign}
        onTransactionCancel={onTransactionCancel}
        onTransactionError={onTransactionError}
      />,
      {
        disableLifecycleMethods: true,
      }
    )
  }
})
