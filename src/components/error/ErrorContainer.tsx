import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import ErrorView from 'components/error/ErrorView'
import AppState from 'store/AppState'
import RoutePath from 'constants/routePath'

interface Props extends RouteComponentProps {
  error: string
}

export class ErrorContainer extends React.Component<Props> {
  public static displayName = 'ErrorContainer'

  public onBackToAuths = () => {
    this.props.history.push(RoutePath.AUTHS)
  }

  public render() {
    return (
      <ErrorView error={this.props.error} onBackToAuths={this.onBackToAuths}/>
    )
  }
}

export const mapStateToProps = (state: AppState) => ({
  error: state.request.data.requestError,
})

export default withRouter(connect(mapStateToProps)(ErrorContainer))
