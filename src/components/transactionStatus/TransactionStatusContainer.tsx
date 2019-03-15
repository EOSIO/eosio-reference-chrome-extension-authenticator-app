import * as React from 'react'

import TXStatus from 'constants/txStatus'
import TransactionStatusView from 'components/transactionStatus/TransactionStatusView'
import approvedIcon from 'assets/images/approved-icon.svg'
import cancelledIcon from 'assets/images/cancelled-icon.svg'

interface Props {
  status: TXStatus
}

export const APPROVED_DETAILS = {
  TITLE: 'Approved',
  BODY: 'Contract was successfully approved, this window will now close.',
  ICON: approvedIcon,
}

export const CANCELLED_DETAILS = {
  TITLE: 'Cancelled',
  BODY: 'Contract was cancelled, this window will now close.',
  ICON: cancelledIcon,
}

const TransactionStatusContainer: React.SFC<Props> = ({ status }: Props) => {
  const details = status === TXStatus.SIGNED ? APPROVED_DETAILS : CANCELLED_DETAILS

  return (
    <TransactionStatusView
      title={details.TITLE}
      body={details.BODY}
      icon={details.ICON}
    />
  )
}

TransactionStatusContainer.displayName = 'TransactionStatusContainer'

export default TransactionStatusContainer
