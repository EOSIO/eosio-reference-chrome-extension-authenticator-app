import * as React from 'react'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import './App.css'

import AddAuthContainer from 'components/auth/AddAuth/AddAuthContainer'
import AuthListContainer from 'components/auth/AuthList/AuthListContainer'
import SelectiveDisclosureContainer from 'components/selectiveDisclosure/SelectiveDisclosureContainer'
import TransactionContainer from 'components/transaction/TransactionContainer'
import CreatePassphraseContainer from 'components/passphrase/createPassphrase/CreatePassphraseContainer'
import RoutePath from 'constants/routePath'
import ErrorContainer from 'components/error/ErrorContainer'
import AuthDetailsContainer from 'components/auth/AuthDetails/AuthDetailsContainer'
import PageTransitionAnimation from 'components/shared/animations/pageTransition/PageTransitionAnimation'

const App: React.SFC<RouteComponentProps> = ({ location }) => (
  <div className='app-container'>
    <PageTransitionAnimation rootSwitch>
      <Switch location={location}>
        <Route
          path={RoutePath.AUTHS}
          render={() => <AuthListContainer />}
        />

        <Route
          path={RoutePath.AUTH_DETAILS_VIEW}
          render={(props) => (<AuthDetailsContainer publicKey={props.match.params.publicKey} />)}
        />

        <Route
          path={RoutePath.ADD_AUTH}
          render={() => <AddAuthContainer />}
        />

        <Route
          path={RoutePath.SELECTIVE_DISCLOSURE}
          render={() => <SelectiveDisclosureContainer />}
        />

        <Route
          path={RoutePath.TRANSACTION}
          render={() => <TransactionContainer />}
        />

        <Route
          path={RoutePath.ERROR}
          render={() => <ErrorContainer />}
        />

        <Route
          path={RoutePath.CREATE_PASSPHRASE}
          render={() => <CreatePassphraseContainer />}
        />
      </Switch>
    </PageTransitionAnimation>
  </div>
)

App.displayName = 'App'

export default withRouter(App)
