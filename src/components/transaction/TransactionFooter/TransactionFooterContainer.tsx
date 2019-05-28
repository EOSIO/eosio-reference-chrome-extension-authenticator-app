import * as React from 'react'
import { connect } from 'react-redux'
import {
  ChainInfo,
  SignatureProviderRequestEnvelope,
  SignatureProviderRequest,
} from 'eosjs-signature-provider-interface'

import TransactionFooterView from 'components/transaction/TransactionFooter/TransactionFooterView'
import AppState from 'store/AppState'
import { DappInfo } from 'utils/manifest/DappInfo'
import { TransactionInfo } from 'eos/Transaction'

interface Props {
  dappInfo: DappInfo
  requestEnvelope: SignatureProviderRequestEnvelope
  transactionInfo: TransactionInfo

  canAccept: boolean
  onTransactionSign: () => void
  onTransactionCancel: () => void
  onTransactionError: (error: string) => void
}

export class TransactionFooterContainer extends React.Component<Props> {
  public render() {
    const { canAccept, onTransactionSign, onTransactionCancel } = this.props

    return (
      <TransactionFooterView
        chainInfo={this.chainInfo}
        actor={this.actor}
        canAccept={canAccept}
        onTransactionSign={onTransactionSign}
        onTransactionCancel={onTransactionCancel}
      />
    )
  }

  private get request(): SignatureProviderRequest {
    return this.props.requestEnvelope.request
  }

  private get chainInfo(): ChainInfo {
    const { chainId } = this.request.transactionSignature
    const { appMetadataInfo: { appMetadata } } = this.props.dappInfo
    return appMetadata.chains.find((currentChain: ChainInfo) => chainId === currentChain.chainId)
  }

  private get actor(): string {
    const transactionInfo = this.props.transactionInfo
    // TODO: more complex actor retrieval logic, can there be more than one?
    const authorization = transactionInfo && transactionInfo.actions && transactionInfo.actions[0].authorization[0]

    if (!authorization) {
      this.props.onTransactionError('The transaction has no authorization.')
      return null
    }

    const { actor } = authorization
    return actor
  }
}

export const mapStateToProps = (state: AppState) => ({
  dappInfo: state.dappInfo.data,
  requestEnvelope: state.request.data.requestEnvelope,
  transactionInfo: state.request.data.transactionInfo,
})

export default connect(mapStateToProps)(TransactionFooterContainer)
