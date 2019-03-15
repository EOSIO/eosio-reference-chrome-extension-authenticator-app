import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import LoadingOverlay from './LoadingOverlay'

describe('LoadingOverlay', () => {
  let loadingOverlay: ShallowWrapper

  beforeEach(() => {
    loadingOverlay = shallow(
      <LoadingOverlay />,
    )
  })

  describe('rendering', () => {
    it('renders the image', () => {
      expect(loadingOverlay.find('h1').length).toBe(1)
    })
  })
})
