import * as React from 'react'
import { ChainInfo } from 'eosjs-signature-provider-interface'
import './TransactionFooterView.css'

import FooterView from 'components/shared/layout/FooterView'
import Button from 'components/shared/button/Button'

interface Props {
  chainInfo: ChainInfo
  actor: string
  canAccept: boolean
  onTransactionCancel: () => void
  onTransactionSign: () => void
}

const TransactionFooterView: React.SFC<Props> = ({
  chainInfo,
  actor,
  canAccept,
  onTransactionCancel: onTransactionCancel,
  onTransactionSign: onTransactionSign,
}) => (
  <div className='transaction-footer'>
    <div className='transaction-signature'>
      Signing as
      <span className='transaction-actor'> {actor} </span> on
      <img className='chain-icon' src={chainInfo.icon} alt='chain-icon' />
      <span className='chain-name'> {chainInfo.chainName} </span>
    </div>
    <FooterView>
      <Button
        id='cancel'
        type='button'
        secondaryStyle
        onClick={onTransactionCancel}
      >
        Cancel
      </Button>
      <Button
        id='approve'
        type='button'
        onClick={onTransactionSign}
        disabled={!canAccept}
      >
        Approve
      </Button>
    </FooterView>
  </div>
)

TransactionFooterView.displayName = 'TransactionFooterView'

export default TransactionFooterView
