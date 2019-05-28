import * as React from 'react'
import { connect } from 'react-redux'
import {
  SignatureProviderRequest,
  SignatureProviderRequestEnvelope,
} from 'eosjs-signature-provider-interface'

import ActionAccordionView from './ActionAccordionView'
import { TransactionInfo, AbiInfo } from 'eos/Transaction'
import AppState from 'store/AppState'
import Api from 'utils/Api'
import { shouldValidate } from 'utils/manifest/SecurityExclusion'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'
import {
  requestEnvelopeSelector,
  transactionInfoWithoutRequireSelector,
} from 'store/request/requestSelectors'

interface Props {
  requestEnvelope: SignatureProviderRequestEnvelope
  transactionInfo: TransactionInfo
  rootUrl: string
  insecureMode: InsecureMode
  onTransactionError: (error: string) => void
  onSetCanAccept: (value: boolean) => void
}

export class ActionAccordionContainer extends React.Component<Props> {
  private api: Api

  constructor(props: Props) {
    super(props)
    const { abis, publicKeys, chainId } = this.request.transactionSignature
    this.api = new Api(abis, publicKeys, chainId)
  }

  public render() {
    const { transactionInfo, onSetCanAccept, onTransactionError } = this.props

    return (
      <ActionAccordionView
        transactionInfo={transactionInfo}
        abis={this.decodedABIs}
        allowUnusedContractVariables={this.allowUnusedContractVariables}
        onSetCanAccept={onSetCanAccept}
        onTransactionError={onTransactionError}
        canOpenMultiple
      />
    )
  }

  private get request(): SignatureProviderRequest {
    return this.props.requestEnvelope.request
  }

  private get decodedABIs(): AbiInfo[] {
    const { abis } = this.request.transactionSignature
    return this.api.decodeAbis(abis)
  }

  private get allowUnusedContractVariables(): boolean {
    return !shouldValidate(
      'relaxedContractParsing',
      this.props.requestEnvelope.securityExclusions,
      this.props.insecureMode,
      this.props.rootUrl,
    )
  }
}

export const mapStateToProps = (state: AppState) => ({
  requestEnvelope: requestEnvelopeSelector(state),
  transactionInfo: transactionInfoWithoutRequireSelector(state),
  rootUrl: state.dappInfo.data.rootUrl,
  insecureMode: state.insecureMode.data,
})

export default connect(mapStateToProps)(ActionAccordionContainer)
