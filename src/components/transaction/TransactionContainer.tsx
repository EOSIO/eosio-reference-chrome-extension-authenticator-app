import * as React from 'react'
import { connect } from 'react-redux'
import {
  SignatureProviderRequestEnvelope,
  SignatureProviderRequest,
  ErrorCodes,
} from 'eosjs-signature-provider-interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import TransactionRoutes from 'components/transaction/TransactionRoutes'
import Auth from 'utils/Auth'
import { TransactionInfo } from 'eos/Transaction'
import getDefaultDappMessenger, { DappMessenger } from 'utils/requests/DappMessenger'
import getDefaultWindowManager, { WindowManager } from 'utils/WindowManager'
import Api from 'utils/Api'
import TXStatus from 'constants/txStatus'
import AppState from 'store/AppState'
import { convertToLegacyPubKey } from 'utils/helpers'
import { decrypt } from 'utils/encrypter'
import {
  createErrorResponseEnvelope,
  createTransactionSignatureResponseEnvelope,
} from 'utils/requests/signatureProviderEnvelopeGenerators'
import RoutePath from 'constants/routePath'
import {
  transactionInfoSelector,
  transactionInfoWithoutRequireSelector,
  requestEnvelopeSelector,
} from 'store/request/requestSelectors'

export const ERROR_MESSAGES = {
  NO_TRANSACTION_INFO: 'No transaction info.',
  NO_ABIS: 'No ABIs found for action.',
  NO_ACTIONS: 'No actions found for transaction.',
}

interface Props extends RouteComponentProps {
  requestEnvelope: SignatureProviderRequestEnvelope
  transactionInfo: TransactionInfo
  auths: Auth[]
  canAccept: boolean
}

interface State {
  canAccept: boolean
  txStatus: TXStatus
}

export class TransactionContainer extends React.Component<Props, State> {
  public static displayName = 'TransactionContainer'

  private dappMessenger: DappMessenger
  private windowManager: WindowManager
  private api: Api

  constructor(props: Props) {
    super(props)

    this.dappMessenger = getDefaultDappMessenger()
    this.windowManager = getDefaultWindowManager()

    const { abis, publicKeys, chainId } = this.request.transactionSignature
    this.api = new Api(abis, publicKeys, chainId)

    this.state = {
      canAccept: props.canAccept,
      txStatus: TXStatus.PENDING,
    }

    this.props.history.push(RoutePath.TRANSACTION_RICARDIAN, { skipAnimation: true })
  }

  public componentDidMount() {
    if (!this.props.transactionInfo) {
      this.onTransactionError(ERROR_MESSAGES.NO_TRANSACTION_INFO)
    } else if (!this.props.transactionInfo.actions) {
      this.onTransactionError(ERROR_MESSAGES.NO_ACTIONS)
    } else if (!this.request.transactionSignature.abis) {
      this.onTransactionError(ERROR_MESSAGES.NO_ABIS)
    }
  }

  public render() {
    const {
      canAccept,
      txStatus,
    } = this.state

    return (
      <React.Fragment>
        <TransactionRoutes
          canAccept={canAccept}
          txStatus={txStatus}
          onTransactionSign={this.onTransactionSign}
          onTransactionCancel={this.onTransactionCancel}
          onTransactionError={this.onTransactionError}
          onSetCanAccept={this.onSetCanAccept}
          onConfirmPassphrase={this.onConfirmPassphrase}
          onFailPassphrase={this.onFailPassphrase}
        />
      </React.Fragment>
    )
  }

  private onConfirmPassphrase = async (passphrase: string) => {
    const publicKeys = this.request.transactionSignature.publicKeys

    try {
      const privateKeys = await this.getPrivateKeys(publicKeys, passphrase)
      const signedTransaction = await this.api.signTx(this.props.transactionInfo, privateKeys)
      const responseEnvelope = createTransactionSignatureResponseEnvelope(
        this.props.requestEnvelope.id,
        signedTransaction,
      )
      this.dappMessenger.sendMessage(responseEnvelope)
      this.props.history.push(RoutePath.TRANSACTION_APPROVED)
      this.windowManager.closeCurrentWindow(1500)
    } catch (e) {
      this.onTransactionError(e.message)
    }
  }

  private onFailPassphrase = () => {
    this.onTransactionError('Failed to authenticate')
  }

  private onTransactionSign = () => {
    this.props.history.push(RoutePath.TRANSACTION_CONFIRM_PASSPHRASE)
  }

  private onTransactionCancel = () => {
    this.props.history.push(RoutePath.TRANSACTION_CANCELLED)
    this.dappMessenger.sendMessage(
      createErrorResponseEnvelope(this.props.requestEnvelope, {
        reason: 'The transaction was cancelled by the specified authority',
        errorCode: ErrorCodes.signingError,
        contextualInfo: '',
      }),
    )
    this.windowManager.closeCurrentWindow(1500)
  }

  private onTransactionError = (error: string) => {
    this.dappMessenger.sendMessage(
      createErrorResponseEnvelope(this.props.requestEnvelope, {
        reason: error,
        errorCode: ErrorCodes.transactionError,
        contextualInfo: '',
      }),
    )
    this.windowManager.closeCurrentWindow()
  }

  private onSetCanAccept = (value: boolean) => this.setState(({ canAccept: value }))

  private get request(): SignatureProviderRequest {
    return this.props.requestEnvelope.request
  }

  private async getPrivateKeys(publicKeys: string[], passphrase: string): Promise<string[]> {
    const legacyPublicKeys = publicKeys.map((publicKey) => convertToLegacyPubKey(publicKey))
    const allPublicKeys = [...publicKeys, ...legacyPublicKeys]

    return this.props.auths.reduce(async (previousPromise, auth) => {
      const collection = await previousPromise
      if (allPublicKeys.includes(auth.publicKey)) {
        const privateKey = await decrypt(auth.encryptedPrivateKey, passphrase)
        collection.push(privateKey)
      }
      return collection
    }, Promise.resolve([]))
  }
}

export const mapStateToProps = (state: AppState) => ({
  requestEnvelope: requestEnvelopeSelector(state),
  transactionInfo: transactionInfoSelector(state),
  auths: state.auths.data,
  canAccept: transactionInfoWithoutRequireSelector(state).actions.length === 1,
})

export default withRouter(connect(mapStateToProps)(TransactionContainer))
