import * as React from 'react'
import { AppMetadata } from 'eosjs-signature-provider-interface'
import './TransactionHeaderView.css'

interface Props {
  appRoot: string
  appMetadata: AppMetadata
}

const TransactionHeaderView: React.SFC<Props> = ({ appRoot, appMetadata }) => (
  <div className='transaction-header'>
    <div className='transaction-header-grid'>
      <img className='application-icon' src={appMetadata.icon} alt='' />
      <h2 className='application-title'>{appMetadata.shortname}</h2>
      <span className='application-root'>{appRoot}</span>
    </div>
  </div>
)

TransactionHeaderView.displayName = 'TransactionHeaderView'

export default TransactionHeaderView
