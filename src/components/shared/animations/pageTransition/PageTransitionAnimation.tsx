import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import classNames from 'classnames'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './PageTransitionAnimation.css'

const ANIMATION_TIMEOUT: number = 300

interface Props extends RouteComponentProps {
  rootSwitch?: boolean
}

export const PageTransitionAnimation: React.SFC<Props> = ({
  rootSwitch = false,
  history,
  location,
  children,
}) => {
  let key = location.pathname
  if (rootSwitch) {
    const pathname = location.pathname
    key = pathname.split('/')[1]
  }
  const state = history.location.state
  const skipAnimation = (history.action !== 'POP' && state) ? history.location.state.skipAnimation : false

  const transitionGroupClasses = classNames({
    'page-transition-container': true,
    'page-transition-container--back': history.action === 'POP',
  })

  return (
    <TransitionGroup enter={!skipAnimation} className={transitionGroupClasses}>
      <CSSTransition
        key={key}
        timeout={{ enter: ANIMATION_TIMEOUT, exit: ANIMATION_TIMEOUT }}
        className='page-transition'
        classNames='page-transition'
      >
        <div children={children} />
      </CSSTransition>
    </TransitionGroup>
  )
}

PageTransitionAnimation.displayName = 'PageTransitionAnimation'

export default withRouter(PageTransitionAnimation)
