import * as React from 'react'
import { ShallowWrapper, shallow } from 'enzyme'
import BodyView from './BodyView'

describe('BodyView', () => {
  let bodyView: ShallowWrapper

  beforeEach(() => {
    bodyView = shallow(
      <BodyView>
        <p>Test</p>
      </BodyView>
    )
  })

  describe('rendering', () => {
    it('renders children', () => {
      expect(bodyView.find('p')).toHaveLength(1)
    })
  })
})
