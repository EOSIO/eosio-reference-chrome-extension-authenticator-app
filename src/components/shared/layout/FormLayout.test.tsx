import * as React from 'react'
import { ShallowWrapper, shallow } from 'enzyme'
import FormLayout from './FormLayout'

describe('FormLayout', () => {
  let formLayout: ShallowWrapper
  let onSubmit: jest.Mock

  beforeEach(() => {
    onSubmit = jest.fn()

    formLayout = shallow(
      <FormLayout onSubmit={onSubmit}>
        <p>Test</p>
      </FormLayout>
    )
  })

  describe('rendering', () => {
    it('is a form', () => {
      expect(formLayout.find('form')).toHaveLength(1)
    })

    it('renders children', () => {
      expect(formLayout.find('p')).toHaveLength(1)
    })

    it('passes props to the form', () => {
      expect(formLayout.find('form').prop('onSubmit')).toBe(onSubmit)
    })
  })
})
