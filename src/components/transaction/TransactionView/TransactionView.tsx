import * as React from 'react'

import BodyView from 'components/shared/layout/BodyView'
import TransactionHeaderContainer from '../TransactionHeader/TransactionHeaderContainer'
import TransactionFooterContainer from '../TransactionFooter/TransactionFooterContainer'
import ActionAccordionContainer from '../ActionAccordion/ActionAccordionContainer'

interface Props {
  canAccept: boolean

  onTransactionSign: () => void
  onTransactionCancel: () => void
  onTransactionError: (error: string) => void
  onSetCanAccept: (value: boolean) => void
}

const TransactionView: React.SFC<Props> = ({
  canAccept,
  onSetCanAccept,
  onTransactionSign,
  onTransactionCancel,
  onTransactionError,
}: Props) => (
  <React.Fragment>
    <TransactionHeaderContainer />
    <BodyView>
      <ActionAccordionContainer
        onSetCanAccept={onSetCanAccept}
        onTransactionError={onTransactionError}
      />
    </BodyView>
    <TransactionFooterContainer
      canAccept={canAccept}
      onTransactionSign={onTransactionSign}
      onTransactionCancel={onTransactionCancel}
      onTransactionError={onTransactionError}
    />
  </React.Fragment>
)

TransactionView.displayName = 'TransactionView'

export default TransactionView
