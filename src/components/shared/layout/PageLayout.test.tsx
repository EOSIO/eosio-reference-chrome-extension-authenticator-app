import * as React from 'react'
import { ShallowWrapper, shallow } from 'enzyme'
import PageLayout from './PageLayout'

describe('PageLayout', () => {
  let pageLayout: ShallowWrapper

  beforeEach(() => {
    pageLayout = shallow(
      <PageLayout id='id'>
        <p>Test</p>
      </PageLayout>
    )
  })

  describe('rendering', () => {
    it('is a div', () => {
      expect(pageLayout.find('div')).toHaveLength(1)
    })

    it('renders children', () => {
      expect(pageLayout.find('p')).toHaveLength(1)
    })

    it('passes props to the div', () => {
      expect(pageLayout.find('div').prop('id')).toBe('id')
    })
  })
})
