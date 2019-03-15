import * as React from 'react'
import { connect } from 'react-redux'
import { MemoryRouter as Router } from 'react-router-dom'
import 'assets/styles/core.css'

import AppContainer from 'AppContainer'
import SettingsView from 'components/settings/SettingsView'
import LoadingOverlay from 'components/shared/LoadingOverlay'
import AppState from 'store/AppState'
import { Dispatch } from 'store/storeHelpers'
import { globalLoad } from 'store/global/globalActions'
import { startStoreListeners, stopStoreListeners } from 'store/storeListeners'
import RoutePath from 'constants/routePath'

interface Props {
  isLoading: boolean
  globalLoad: () => void
  passphraseHash: string
}

export class Root extends React.Component<Props> {
  public async componentDidMount() {
    await this.props.globalLoad()
    startStoreListeners()
  }

  public componentWillUnmount() {
    stopStoreListeners()
  }

  public render() {
    const { isLoading } = this.props

    if (window.location.hash === '#options') {
      return(
        <Router initialEntries={[RoutePath.GENERAL_SETTINGS]}>
          <SettingsView />
        </Router>
      )
    }

    return (
      <Router>
        {isLoading ? <LoadingOverlay /> : <AppContainer />}
      </Router>
    )
  }
}

export const mapStateToProps = (state: AppState) => {
  return {
    isLoading: state.global.loading,
    passphraseHash: state.passphraseHash.data,
  }
}

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  globalLoad: () => dispatch(globalLoad()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Root)
