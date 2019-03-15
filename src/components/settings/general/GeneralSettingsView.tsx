import * as React from 'react'

import UpdatePassphraseContainer from 'components/passphrase/updatePassphrase/UpdatePassphraseContainer'

const GeneralSettingsView: React.SFC = () => (
  <React.Fragment>
    <h1 className='general-settings-title'>General Settings</h1>
    <p className='general-settings-info'>
      Here you'll find general settings that can be applied universally across the
      EOSIO Reference Chrome Extension Authenticator App.
    </p>
    <hr />
    <UpdatePassphraseContainer />
  </React.Fragment>
)

GeneralSettingsView.displayName = 'GeneralSettingsView'

export default GeneralSettingsView
