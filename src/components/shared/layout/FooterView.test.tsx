import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import FooterView from './FooterView'

describe('LoadingOverlay', () => {
  let footerView: ShallowWrapper
  let childrenMarkup: React.ReactNode

  beforeEach(() => {
    childrenMarkup = <div className='test-class'>test</div>
    footerView = shallow(
      <FooterView>{childrenMarkup}</FooterView>,
    )
  })

  describe('rendering', () => {
    it('renders the children', () => {
      expect(footerView.find('.test-class')).toHaveLength(1)
      expect(footerView.prop('children')).toEqual(childrenMarkup)
    })
  })
})
