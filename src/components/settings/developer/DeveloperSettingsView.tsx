import * as React from 'react'

import InsecureModeContainer from 'components/insecureMode/InsecureModeContainer'

const DeveloperSettingsView: React.SFC = () => (
  <React.Fragment>
    <h1 className='developer-settings-title'>Developer Settings</h1>
    <p className='developer-settings-info'>
      If you’re a developer, you may find use in some of these settings.
      These are settings that should be used with discretion.
    </p>
    <hr/>
    <InsecureModeContainer />
  </React.Fragment>
)

DeveloperSettingsView.displayName = 'DeveloperSettingsView'

export default DeveloperSettingsView
