import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import SelectiveDisclosureView from 'components/selectiveDisclosure/SelectiveDisclosureView'
import Button from 'components/shared/button/Button'

describe('SelectiveDisclosureView', () => {
  let selectiveDisclosureView: ShallowWrapper
  let dappName: string
  let dappIcon: any
  let dappDeclaredDomain: string
  let onDeny: jest.Mock
  let onAccept: jest.Mock

  beforeEach(() => {
    dappName = 'test name'
    dappIcon = 'test icon'
    dappDeclaredDomain = 'test.com'
    onDeny = jest.fn()
    onAccept = jest.fn()

    selectiveDisclosureView = shallow(
      <SelectiveDisclosureView
        dappName={dappName}
        dappIcon={dappIcon}
        dappDeclaredDomain={dappDeclaredDomain}
        onDeny={onDeny}
        onAccept={onAccept}
      />,
    )
  })

  describe('rendering', () => {
    it('displays the dapp name in the title', () => {
      expect(selectiveDisclosureView.find('.disclosure-title').text()).toContain(dappName)
    })

    it('displays the dapp icon', () => {
      expect(selectiveDisclosureView.find('.disclosure-icon').props().src).toEqual(dappIcon)
    })

    it('displays the dapp declared domain', () => {
      expect(selectiveDisclosureView.find('.disclosure-domain-name').text()).toContain(dappDeclaredDomain)
    })

    it('renders two footer button components', () => {
      expect(selectiveDisclosureView.find(Button).length).toBe(2)
    })

    it('clicking Deny should invoke the onDeny handler', () => {
      selectiveDisclosureView.find(Button).first().prop('onClick')()
      expect(onDeny).toHaveBeenCalled()
    })

    it('clicking Accept should invoke the onAccept handler', () => {
      selectiveDisclosureView.find(Button).at(1).prop('onClick')()
      expect(onAccept).toHaveBeenCalled()
    })
  })
})
