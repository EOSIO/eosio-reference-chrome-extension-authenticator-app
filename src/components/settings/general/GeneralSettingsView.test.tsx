import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import GeneralSettingsView from './GeneralSettingsView'
import UpdatePassphraseContainer from 'components/passphrase/updatePassphrase/UpdatePassphraseContainer'

describe('GeneralSettingsView', () => {
  let generalSettings: ShallowWrapper

  beforeEach(() => {
    generalSettings = shallow(<GeneralSettingsView />)
  })

  it('renders the GeneralSettings title', () => {
    const title = generalSettings.find('.general-settings-title')

    expect(title).toHaveLength(1)
    expect(title.text()).toBe('General Settings')
  })

  it('renders the GeneralSettings info', () => {
    const info = generalSettings.find('.general-settings-info')

    expect(info).toHaveLength(1)
    expect(info.text()).toBe(
      'Here you\'ll find general settings that can be applied universally across the EOSIO ' +
      'Reference Chrome Extension Authenticator App.',
    )
  })

  it('renders the UpdatePassphraseContainer', () => {
    expect(generalSettings.find(UpdatePassphraseContainer)).toHaveLength(1)
  })
})
