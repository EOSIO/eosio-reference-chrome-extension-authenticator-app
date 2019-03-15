import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import AuthDetailsRoutes from './AuthDetailsRoutes'
import DappRequest from 'utils/requests/DappRequest'
import AppState from 'store/AppState'
import { Dispatch } from 'store/storeHelpers'
import { authDelayedRemove, authUpdate } from 'store/auths/authsActions'
import Auth from 'utils/Auth'
import RoutePath from 'constants/routePath'

interface Props extends RouteComponentProps {
  publicKey: any
  auths: Auth[]
  request: DappRequest
  onAuthRemove: (publicKey: string) => void
  onAuthUpdate: (currentNickname: string, newNickname: string) => void
}

export class AuthDetailsContainer extends React.Component<Props> {
  public static displayName = 'AuthDetailsContainer'

  public render() {
    return (
      <AuthDetailsRoutes
        auth={this.auth}
        auths={this.props.auths}
        onAuthUpdate={this.props.onAuthUpdate}
        onAuthRemove={this.onAuthRemove}
        onConfirmPassphrase={this.onConfirmPassphrase}
        onFailPassphrase={this.onFailPassphrase}
      />
    )
  }

  private get auth(): Auth {
    return this.props.auths.find((auth) => auth.publicKey === this.props.publicKey)
  }

  private onAuthRemove = () => {
    this.props.history.push(`${RoutePath.AUTH_DETAILS}/${this.props.publicKey}/confirmPassphrase`)
  }

  private onConfirmPassphrase = () => {
    this.props.onAuthRemove(this.auth.publicKey)
    this.goBackToAuthListView()
  }

  private onFailPassphrase = () => {
    // TODO: Better UX
    this.props.history.goBack()
  }

  private goBackToAuthListView() {
    this.props.history.go(-2)
  }
}

export const mapStateToProps = (state: AppState) => ({
  request: state.request.data,
  auths: state.auths.data,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAuthUpdate: (currentNickname: string, newNickname: string) => {
    dispatch(authUpdate(currentNickname, newNickname))
  },
  onAuthRemove: (publicKey: string) => {
    dispatch(authDelayedRemove(publicKey))
  },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthDetailsContainer))
