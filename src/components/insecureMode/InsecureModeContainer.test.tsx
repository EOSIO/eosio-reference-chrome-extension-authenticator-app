import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import { InsecureModeContainer, mapStateToProps, mapDispatchToProps } from './InsecureModeContainer'
import InsecureModeView from 'components/insecureMode/InsecureModeView'
import WhitelistContainer from 'components/insecureMode/whitelist/WhitelistContainer'
import * as insecureModeActions from 'store/insecureMode/insecureModeActions'

describe('InsecureModeContainer', () => {
  let insecureModeContainer: ShallowWrapper
  const dispatch = jest.fn()
  const onInsecureModeToggle = jest.fn()

  beforeEach(() => {
    insecureModeContainer = shallow(
      <InsecureModeContainer
        enabled
        onInsecureModeEnabled={onInsecureModeToggle}
      />,
    )
  })

  describe('when rendered', () => {
    it('should render the InsecureModeScreen', () => {
      expect(insecureModeContainer.find(InsecureModeView).length).toBe(1)
    })

    it('should render the WhitelistContainer', async () => {
      expect(insecureModeContainer.find(WhitelistContainer).length).toBe(1)
    })

    it('should not render white list if insecure mode is disabled', () => {
      insecureModeContainer = shallow(
        <InsecureModeContainer
          enabled={false}
          onInsecureModeEnabled={jest.fn()}
        />,
      )
      expect(insecureModeContainer.find(WhitelistContainer).length).toBe(0)
    })

    it('should invoke onInsecureModeToggle when insecureMode is toggled', () => {
      const event = {
        target: {
          checked: false,
        },
      }
      insecureModeContainer.find(InsecureModeView).prop('onChange')(event as React.ChangeEvent<HTMLInputElement>)
      expect(onInsecureModeToggle).toHaveBeenCalledWith(false)
    })

    it('gets props from the redux state', () => {
      const state = {
        insecureMode: {
          data: {
            enabled: true,
          },
        },
      }

      expect(mapStateToProps(state as any).enabled).toBe(true)
    })

    it('maps onInsecurModeToggle to insecureModeToggle action', async () => {
      const { onInsecureModeEnabled: dispatchEnabledAction } = mapDispatchToProps(dispatch)

      jest.spyOn(insecureModeActions, 'insecureModeEnabled').mockReturnValue('toggle action')

      dispatchEnabledAction(true)
      expect(dispatch).toHaveBeenCalledWith('toggle action')
    })
  })
})
