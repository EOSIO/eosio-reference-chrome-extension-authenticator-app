import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow,  ShallowWrapper } from 'enzyme'

import DeveloperSettingsView from './DeveloperSettingsView'
import InsecureModeContainer from 'components/insecureMode/InsecureModeContainer'

describe('DeveloperSettingsView', () => {
  let developerSettings: ShallowWrapper

  beforeEach(() => {
    developerSettings = shallow(<DeveloperSettingsView />)
  })

  it('renders the DeveloperSettings title', () => {
    const title = developerSettings.find('.developer-settings-title')

    expect(title).toHaveLength(1)
    expect(title.text()).toBe('Developer Settings')
  })

  it('renders the DeveloperSettings info', () => {
    const info = developerSettings.find('.developer-settings-info')

    expect(info).toHaveLength(1)
    expect(info.text()).toBe(
      'If you’re a developer, you may find use in some of these settings. ' +
      'These are settings that should be used with discretion.',
    )
  })

  it('renders the InsecureModeContainer', () => {
    expect(developerSettings.find(InsecureModeContainer)).toHaveLength(1)
  })
})
