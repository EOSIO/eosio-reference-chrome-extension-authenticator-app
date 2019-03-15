import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import {
  ErrorContainer,
  mapStateToProps,
} from 'components/error/ErrorContainer'
import ErrorView from 'components/error/ErrorView'
import RoutePath from 'constants/routePath'

describe('ErrorContainer', () => {
  let errorContainer: ShallowWrapper
  let history: any

  beforeEach(() => {
    history = {
      push: jest.fn(),
    }

    errorContainer = shallow(
      <ErrorContainer
        error={'The Error'}
        history={history}
        location={null}
        match={null}
      />,
    )
  })

  it('renders the error view', () => {
    const errorContainerInstance = errorContainer.instance() as ErrorContainer
    expect(errorContainer.find(ErrorView).props()).toEqual({
      error: 'The Error',
      onBackToAuths: errorContainerInstance.onBackToAuths,
    })
  })

  it('gets the error prop from the redux state', () => {
    const state = {
      request: {
        data: {
          requestError: 'The Error',
        },
      },
    }

    expect(mapStateToProps(state as any).error).toEqual('The Error')
  })

  describe('onBackToAuths', () => {
    it('navigates to auths page', () => {
      const errorContainerInstance = errorContainer.instance() as ErrorContainer
      errorContainerInstance.onBackToAuths()

      expect(history.push).toHaveBeenCalledWith(RoutePath.AUTHS)
    })
  })
})
