import * as React from 'react'
import { Route, Switch, NavLink } from 'react-router-dom'
import './SettingsView.css'

import DeveloperSettingsView from 'components/settings/developer/DeveloperSettingsView'
import GeneralSettingsView from 'components/settings/general/GeneralSettingsView'
import RoutePath from 'constants/routePath'

class SettingsView extends React.Component {
  public static displayName = 'SettingsView'

  public render() {
    return this.renderSettingsView()
  }

  private renderSettingsView = () => (
    <div className='settings-container'>
      <div className='settings-navigation-container'>
        <div className='settings-navigation-content'>
          {this.renderNavList()}
        </div>
      </div>
      <div className='settings-content-container'>
        {this.renderRoutes()}
      </div>
    </div>
  )

  private renderNavList = () => (
    <ul>
      <li><NavLink to={RoutePath.GENERAL_SETTINGS} activeClassName='active'>General</NavLink></li>
      <li><NavLink to={RoutePath.DEVELOPER_SETTINGS} activeClassName='active'>Developer</NavLink></li>
    </ul>
  )

  private renderRoutes = () => (
    <Switch>
      <Route
        path={RoutePath.GENERAL_SETTINGS}
        render={() => <GeneralSettingsView />}
      />
      <Route
        path={RoutePath.DEVELOPER_SETTINGS}
        render={() => <DeveloperSettingsView />}
      />
    </Switch>
  )
}

export default SettingsView
