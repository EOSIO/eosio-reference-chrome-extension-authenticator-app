import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import Button from 'components/shared/button/Button'

describe('Button', () => {
  let footerButton: ShallowWrapper
  const onClick = jest.fn()

  describe('secondary footer button', () => {
    beforeEach(() => {
      footerButton = shallow(
        <Button
          secondaryStyle
          borderedStyle
          type='button'
          onClick={onClick}
        >
          Button
        </Button>,
      )
    })

    it('renders with the secondary class', () => {
      expect(footerButton.find('button').prop('className')).toContain('secondary')
    })

    it('renders with the bordered class', () => {
      expect(footerButton.find('button').prop('className')).toContain('bordered')
    })

    it('renders with specified text', () => {
      expect(footerButton.find('button').text()).toBe('Button')
    })

    it('invokes the onClick handler', () => {
      const event: any = {}
      footerButton.find('button').prop('onClick')(event)

      expect(onClick).toHaveBeenCalled()
    })
  })
})
