import * as React from 'react'
import { connect } from 'react-redux'

import TransactionHeaderView from 'components/transaction/TransactionHeader/TransactionHeaderView'
import AppState from 'store/AppState'
import { DappInfo } from 'utils/manifest/DappInfo'

interface Props {
  dappInfo: DappInfo
}

export class TransactionHeaderContainer extends React.Component<Props> {
  public render() {
    const { rootUrl, appMetadataInfo: { appMetadata} } = this.props.dappInfo

    return (
      <TransactionHeaderView
        appRoot={rootUrl}
        appMetadata={appMetadata}
      />
    )
  }
}

export const mapStateToProps = (state: AppState) => ({
  dappInfo: state.dappInfo.data,
})

export default connect(mapStateToProps)(TransactionHeaderContainer)
