import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import { Dispatch } from 'store/storeHelpers'
import AuthListView from 'components/auth/AuthList/AuthListView'
import AppState, { DelayedRemovable } from 'store/AppState'
import Auth from 'utils/Auth'
import RoutePath from 'constants/routePath'
import { authDelayedRemoveUndo } from 'store/auths/authsActions'

interface Props extends RouteComponentProps {
  loading: boolean
  auths: Array<DelayedRemovable<Auth>>
  onAuthRemoveUndo: (publicKey: string) => void
}

export class AuthListContainer extends React.Component<Props> {
  public static displayName = 'AuthListContainer'

  public render() {
    return (
      <AuthListView
        loading={this.props.loading}
        auths={this.props.auths}
        onAddAuth={this.onAddAuth}
        onAuthRemoveUndo={this.props.onAuthRemoveUndo}
      />
    )
  }

  private onAddAuth = () => {
    this.props.history.push(RoutePath.ADD_AUTH)
  }
}

export const mapStateToProps = (state: AppState) => ({
  loading: state.auths.loading,
  auths: state.auths.data,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAuthRemoveUndo: (publicKey: string) => {
    dispatch(authDelayedRemoveUndo(publicKey))
  },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthListContainer))
