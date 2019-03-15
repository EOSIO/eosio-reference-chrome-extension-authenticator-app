import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import ErrorView from 'components/error/ErrorView'

describe('ErrorView', () => {
  let errorView: ShallowWrapper
  let error: string
  let onBackToAuths: () => void

  beforeEach(() => {
    error = 'The Error'
    onBackToAuths = jest.fn()

    errorView = shallow(
      <ErrorView error={error} onBackToAuths={onBackToAuths}/>,
    )
  })

  describe('rendering', () => {
    it('displays the error', () => {
      expect(errorView.find('.error-description').text()).toContain(error)
    })
  })
})
