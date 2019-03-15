import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import Checkbox from './Checkbox'

describe('Checkbox', () => {
  let checkbox: ShallowWrapper
  let onChange: jest.Mock
  let children: JSX.Element

  beforeEach(() => {
    onChange = jest.fn()
    children = <div className='test'>test</div>

    checkbox = shallow(
      <Checkbox
        id='checkbox'
        checked
        onChange={onChange}
      >
        {children}
      </Checkbox>,
    )
  })

  describe('rendering', () => {
    it('renders the checkbox wrapper', () => {
      expect(checkbox.find('.checkbox').length).toBe(1)
    })

    it('renders input', () => {
      expect(checkbox.find('.checkbox').childAt(0).type()).toBe('input')
      expect(checkbox.find('.checkbox').childAt(0).prop('checked')).toBe(true)
    })

    it('renders label', () => {
      expect(checkbox.find('.checkbox').childAt(1).type()).toBe('label')
      expect(checkbox.find('.checkbox').childAt(1).prop('htmlFor')).toBe('checkbox')
    })

    it('renders children', () => {
      expect(checkbox.find('.checkbox').find('label').find('div').first().hasClass('test')).toBe(true)
    })

    it('calls callback on change', () => {
      checkbox.find('input').simulate('change')
      expect(onChange).toHaveBeenCalled()
    })
  })
})
