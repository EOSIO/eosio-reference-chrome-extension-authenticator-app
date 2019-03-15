import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Location, History } from 'history'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { PageTransitionAnimation } from './PageTransitionAnimation'

describe('PageTransitionAnimation', () => {
  let pageTransitionAnimation: ShallowWrapper
  let history: History
  let location: Location
  let children: JSX.Element

  beforeEach(() => {
    location = {
      pathname: '/test/page',
      state: { skipAnimation: true },
    } as Location
    history = {
      action: 'REPLACE',
      location,
    } as History
    children = <div className='test'>test</div>

    pageTransitionAnimation = shallow(
      <PageTransitionAnimation
        location={location}
        history={history}
        match={null}
      >
        {children}
      </PageTransitionAnimation>,
    )
  })

  describe('rendering', () => {
    beforeEach(() => {
      renderPageTransitionAnimation()
    })
    it('renders the child', () => {
      expect(pageTransitionAnimation.find('.test').length).toBe(1)
    })
  })

  describe('direction', () => {
    describe('when going forward', () => {
      beforeEach(() => {
        renderPageTransitionAnimation()
      })

      it('does not set the "back" css class', () => {
        expect(pageTransitionAnimation.prop('className')).not.toContain('page-transition-container--back')
      })
    })

    describe('when going back', () => {
      beforeEach(() => {
        history.action = 'POP'
        renderPageTransitionAnimation()
      })

      it('sets the "back" css class', () => {
        expect(pageTransitionAnimation.prop('className')).toContain('page-transition-container--back')
      })

      it('should animate the enter transition', () => {
        expect(pageTransitionAnimation.find(TransitionGroup).prop('enter')).toBe(true)
      })
    })
  })

  describe('entering', () => {
    it('does not animate entering when skipAnimation is true, and action is not POP', () => {
      renderPageTransitionAnimation()
      expect(pageTransitionAnimation.find(TransitionGroup).prop('enter')).toBe(false)
    })

    it('animates entering when state is not defined', () => {
      history.location.state = undefined
      renderPageTransitionAnimation()
      expect(pageTransitionAnimation.find(TransitionGroup).prop('enter')).toBe(true)
    })

    it('animates entering transition when skipAnimation is true', () => {
      history.location.state = { shouldAnimate: true }
      renderPageTransitionAnimation()
      expect(pageTransitionAnimation.find(TransitionGroup).prop('enter')).toBe(true)
    })
  })

  describe('CSSTransition key', () => {
    describe('when the component is not the root switch', () => {
      beforeEach(() => {
        renderPageTransitionAnimation()
      })

      it('uses the location pathname for the key', () => {
        const cssTransition = pageTransitionAnimation.find(CSSTransition)
        expect(cssTransition.key()).toBe(location.pathname)
      })
    })

    describe('when the component is the root switch', () => {
      beforeEach(() => {
        renderPageTransitionAnimation({
          rootSwitch: true,
        })
      })

      it('uses just the first part of the location pathname for the key', () => {
        const cssTransition = pageTransitionAnimation.find(CSSTransition)
        expect(cssTransition.key()).toBe('test')
      })
    })
  })

  const renderPageTransitionAnimation = (props?: any) => {
    pageTransitionAnimation = shallow(
      <PageTransitionAnimation
        location={location}
        history={history}
        match={null}
        {...props}
      >
        {children}
      </PageTransitionAnimation>,
    )
  }
})
