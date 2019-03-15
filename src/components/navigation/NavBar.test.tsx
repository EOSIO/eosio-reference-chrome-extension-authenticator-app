import '__mocks__/chrome.mock'

import * as React from 'react'
import { mount, shallow, ShallowWrapper } from 'enzyme'
import { MemoryRouter as Router, Route } from 'react-router-dom'

import { NavBar, ButtonProps, settingsButton, ButtonAction } from 'components/navigation/NavBar'
import RoutePath from 'constants/routePath'

declare var global: any

describe('NavBar', () => {
  let navBar: ShallowWrapper
  let action: ButtonAction
  let renderLogo: boolean
  let history: any

  beforeEach(() => {
    jest.clearAllMocks()

    history = {
      index: 0,
      push: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
    }
  })

  describe('rendering', () => {
    describe('at index greater than 0 in the history entries', () => {
      beforeEach(() => {
        history.index = 1
        navBar = getShallowNavBar()
      })

      it('should render the back button', () => {
        expect(navBar.find('.navbar-left .nav-button').length).toEqual(1)
      })

      it('should goBack in history on back button click', () => {
        navBar.find('.navbar-left .nav-button').simulate('click')
        expect(history.goBack).toHaveBeenCalled()
      })
    })

    describe('at index 0 in the history entries', () => {
      beforeEach(() => {
        history.index = 0
        navBar = getShallowNavBar()
      })

      it('should not render the back button', () => {
        expect(navBar.find('.navbar-left .nav-button').length).toEqual(0)
      })
    })

    describe('without an action', () => {
      beforeEach(() => {
        action = null
        navBar = getShallowNavBar()
      })

      it('should not render the action button', () => {
        expect(navBar.find('.navbar-right img').length).toEqual(0)
      })
    })

    describe('with an action', () => {
      describe('that is a route path', () => {
        beforeEach(() => {
          action = RoutePath.TRANSACTION
          navBar = getShallowNavBar()
        })

        it('should create an action to push that route to the history', () => {
          navBar.find('.navbar-right img').simulate('click')
          expect(history.push).toHaveBeenCalledWith(RoutePath.TRANSACTION)
        })
      })

      describe('that is an arrow function', () => {
        beforeEach(() => {
          action = jest.fn()
          navBar = getShallowNavBar()
        })

        it('should create an action to push that route to the history', () => {
          navBar.find('.navbar-right img').simulate('click')
          expect(action).toHaveBeenCalledWith()
        })
      })
    })

    describe('with renderLogo false and history exists', () => {
      beforeEach(() => {
        renderLogo = false
        history.index = 1
        navBar = getShallowNavBar()
      })

      it('does not render the logo', () => {
        expect(navBar.find('.navbar-left .navbar-logo').length).toEqual(0)
      })

      it('does not render the back button', () => {
        expect(navBar.find('.navbar-left .nav-button').length).toEqual(1)
      })
    })

    describe('with renderLogo true', () => {
      beforeEach(() => {
        renderLogo = true
        navBar = getShallowNavBar()
      })

      it('does render the logo', () => {
        expect(navBar.find('.navbar-left .navbar-logo').length).toEqual(1)
      })

      it('does not render the back button', () => {
        expect(navBar.find('.navbar-left .navbar-button').length).toEqual(0)
      })
    })
  })

  describe('settingsButton action', () => {
    let goToSettings

    beforeEach(() => {
      global.chrome.runtime = {
        getURL: jest.fn().mockReturnValue('testURL'),
      }
      global.window.open = jest.fn()

      goToSettings = settingsButton.action as () => void
      goToSettings()
    })

    it('should retrieve the options page', () => {
      expect(chrome.runtime.getURL).toHaveBeenCalledWith('index.html#options')
    })

    it('should open the options page', () => {
      expect(window.open).toHaveBeenCalledWith('testURL')
    })
  })

  const getShallowNavBar = () => {
    const button: ButtonProps = action ? {
      imageSrc: 'src',
      action,
    } : null
    const router = mount(
      <Router>
        <Route
          render={() => renderNavBar(button)}
        />
      </Router>,
    )
    return shallow(router.find(NavBar).getElement(), { disableLifecycleMethods: true })
  }

  const renderNavBar = (button: ButtonProps) => (
    <NavBar
      history={history}
      rightButton={button}
      renderLogo={renderLogo}
      match={null}
      location={null}
    />
  )
})
