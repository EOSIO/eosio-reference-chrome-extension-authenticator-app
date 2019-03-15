import * as React from 'react'
import './TransactionStatusView.css'

import BodyView from 'components/shared/layout/BodyView'

interface Props {
  title: string
  body: string
  icon: string
}

const TransactionStatusView: React.SFC<Props> = (props: Props) => (
  <BodyView className='transaction-status-container'>
    <div className='transaction-status-content'>
      <img src={props.icon} alt='transactionStatusIcon' />
      <h1>{props.title}</h1>
      <p>{props.body}</p>
    </div>
  </BodyView>
)

export default TransactionStatusView
