import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  ErrorCodes,
  envelopeDataType,
  EnvelopeDataType,
} from 'eosjs-signature-provider-interface'

import App from 'App'
import RoutePath from 'constants/routePath'
import { Dispatch } from 'store/storeHelpers'
import AppState, { DelayedRemovable } from 'store/AppState'
import { authDelayedRemove } from 'store/auths/authsActions'
import getDefaultDappMessenger from 'utils/requests/DappMessenger'
import { createErrorResponseEnvelope } from 'utils/requests/signatureProviderEnvelopeGenerators'
import DappRequest from 'utils/requests/DappRequest'
import Auth from 'utils/Auth'

interface Props extends RouteComponentProps {
  request: DappRequest
  passphraseHash: string
  auths: Array<DelayedRemovable<Auth>>
  authDelayedRemove: (publicKey: string) => void
}

export class AppContainer extends React.Component<Props> {
  public static displayName = 'AppContainer'
  private dappMessenger = getDefaultDappMessenger()

  constructor(props: Props) {
    super(props)

    this.initRoute()
    this.registerWindowUnload()
    this.continuePendingAuthRemovals()
  }

  public render() {
    return(
      <App />
    )
  }

  private async initRoute() {
    const { history, passphraseHash, request } = this.props
    const routeState = { skipAnimation: true }

    if (passphraseHash) {
      history.replace(this.getRouteFromRequest(request), routeState)
    } else {
      history.replace(RoutePath.CREATE_PASSPHRASE, routeState)
    }
  }

  private getRouteFromRequest(dappRequest: DappRequest): RoutePath {
    if (dappRequest.requestError) {
      return RoutePath.ERROR
    }

    const action = envelopeDataType(dappRequest.requestEnvelope)
    switch (action) {
    case EnvelopeDataType.SELECTIVE_DISCLOSURE:
      return RoutePath.SELECTIVE_DISCLOSURE
    case EnvelopeDataType.TRANSACTION_SIGNATURE:
      return RoutePath.TRANSACTION
    default:
      return RoutePath.AUTHS
    }
  }

  private registerWindowUnload() {
    window.addEventListener('beforeunload', () => {
      this.sendRejectMessageIfNeeded()
    })
  }

  private sendRejectMessageIfNeeded() {
    if (!this.props.request || this.props.request.newRequest) {
      return
    }

    this.dappMessenger.sendMessage(
      createErrorResponseEnvelope(this.props.request.requestEnvelope, {
        reason: 'The action was rejected because the user closed the window.',
        errorCode: ErrorCodes.unexpectedError,
        contextualInfo: '',
      }),
    )
  }

  private continuePendingAuthRemovals() {
    for (const auth of this.props.auths) {
      if (auth.removing) {
        this.props.authDelayedRemove(auth.publicKey)
      }
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  request: state.request.data,
  passphraseHash: state.passphraseHash.data,
  auths: state.auths.data,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  authDelayedRemove: (publicKey: string) => {
    dispatch(authDelayedRemove(publicKey))
  },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppContainer))
