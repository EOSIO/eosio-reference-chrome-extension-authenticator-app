import * as React from 'react'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'

import RoutePath from 'constants/routePath'
import TXStatus from 'constants/txStatus'
import PageLayout from 'components/shared/layout/PageLayout'
import ConfirmPassphraseContainer from 'components/passphrase/confirmPassphrase/ConfirmPassphraseContainer'
import TransactionStatusContainer from 'components/transactionStatus/TransactionStatusContainer'
import TransactionView from 'components/transaction/TransactionView/TransactionView'
import PageTransitionAnimation from 'components/shared/animations/pageTransition/PageTransitionAnimation'

interface Props extends RouteComponentProps {
  canAccept: boolean
  txStatus: string

  onTransactionSign: () => void
  onTransactionCancel: () => void
  onTransactionError: (error: string) => void
  onSetCanAccept: (value: boolean) => void
  onConfirmPassphrase: (passphrase: string) => void
  onFailPassphrase: () => void
}

export const TransactionRoutes: React.SFC<Props> = (props) => {
  const renderConfirmPassphrase = () => (
    <ConfirmPassphraseContainer
      onConfirmPassphrase={props.onConfirmPassphrase}
      onFailPassphrase={props.onFailPassphrase}
    />
  )

  const renderRicardianContent = () => {
    const {
      canAccept,
      onSetCanAccept,
      onTransactionSign,
      onTransactionCancel,
      onTransactionError,
    } = props

    return (
      <TransactionView
        canAccept={canAccept}
        onSetCanAccept={onSetCanAccept}
        onTransactionSign={onTransactionSign}
        onTransactionCancel={onTransactionCancel}
        onTransactionError={onTransactionError}
      />
    )
  }

  return (
    <PageTransitionAnimation>
      <PageLayout>
        <Switch location={props.location}>
          <Route
            path={RoutePath.TRANSACTION_APPROVED}
            render={() => (<TransactionStatusContainer status={TXStatus.SIGNED} />)}
          />

          <Route
            path={RoutePath.TRANSACTION_CANCELLED}
            render={() => (<TransactionStatusContainer status={TXStatus.CANCELLED} />)}
          />

          <Route
            path={RoutePath.TRANSACTION_CONFIRM_PASSPHRASE}
            render={() => renderConfirmPassphrase() }
          />

          <Route
            path={RoutePath.TRANSACTION_RICARDIAN}
            render={() => renderRicardianContent()}
          />
        </Switch>
      </PageLayout>
    </PageTransitionAnimation>
  )
}

TransactionRoutes.displayName = 'TransactionRoutes'

export default withRouter(TransactionRoutes)
