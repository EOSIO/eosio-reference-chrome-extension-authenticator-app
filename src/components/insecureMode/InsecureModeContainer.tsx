import * as React from 'react'
import { connect } from 'react-redux'

import InsecureModeView from 'components/insecureMode/InsecureModeView'
import WhitelistContainer from 'components/insecureMode/whitelist/WhitelistContainer'
import AppState from 'store/AppState'
import { Dispatch } from 'store/storeHelpers'
import { insecureModeEnabled } from 'store/insecureMode/insecureModeActions'

interface InsecureModeProps {
  enabled: boolean
  onInsecureModeEnabled: (enabled: boolean) => void
}

export class InsecureModeContainer extends React.Component<InsecureModeProps> {
  public render() {
    return (
      <React.Fragment>
        <InsecureModeView onChange={this.onChange} insecureMode={this.props.enabled} />
        {this.renderWhiteList()}
      </React.Fragment>
    )
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onInsecureModeEnabled(event.target.checked)
  }

  private renderWhiteList = () => {
    if (this.props.enabled) {
      return <WhitelistContainer />
    }
    return undefined
  }
}

export const mapStateToProps = (state: AppState) => ({
  enabled: state.insecureMode.data.enabled,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onInsecureModeEnabled: (enabled: boolean) => {
    dispatch(insecureModeEnabled(enabled))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InsecureModeContainer)
