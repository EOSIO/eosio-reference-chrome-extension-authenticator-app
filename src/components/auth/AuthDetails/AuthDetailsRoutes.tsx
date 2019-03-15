import * as React from 'react'
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router-dom'

import RoutePath from 'constants/routePath'
import ConfirmPassphraseContainer from 'components/passphrase/confirmPassphrase/ConfirmPassphraseContainer'
import PageTransitionAnimation from 'components/shared/animations/pageTransition/PageTransitionAnimation'
import AuthDetailsView from './AuthDetailsView'
import Auth from 'utils/Auth'

interface Props extends RouteComponentProps {
  auth: Auth
  auths: Auth[]
  onAuthRemove: (name: string) => void
  onAuthUpdate: (currentNickname: string, newNickname: string) => void
  onConfirmPassphrase: () => void
  onFailPassphrase: () => void
}

export const AuthDetailsRoutes: React.SFC<Props> = ({
  auth,
  auths,
  location,
  onAuthUpdate,
  onAuthRemove,
  onConfirmPassphrase,
  onFailPassphrase
}) => (
  <PageTransitionAnimation>
    <Switch location={location}>
      <Route
        exact
        path={RoutePath.AUTH_DETAILS_VIEW}
        render={() => (
          <AuthDetailsView
            auth={auth}
            auths={auths}
            onAuthUpdate={onAuthUpdate}
            onAuthRemove={onAuthRemove}
          />
        )}
      />

      <Route
        path={RoutePath.AUTH_DETAILS_CONFIRM_PASSPHRASE}
        render={() => (
          <ConfirmPassphraseContainer
            onConfirmPassphrase={onConfirmPassphrase}
            onFailPassphrase={onFailPassphrase}
          />
        )}
      />
    </Switch>
  </PageTransitionAnimation>
)

AuthDetailsRoutes.displayName = 'AuthDetailsRoutes'

export default withRouter(AuthDetailsRoutes)
