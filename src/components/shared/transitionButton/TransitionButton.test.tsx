import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import TransitionButton, { TRANSITION_CLASSES } from 'components/shared/transitionButton/TransitionButton'
import Button from 'components/shared/button/Button'

jest.useFakeTimers()

describe('TransitionButton', () => {
  let transitionButton: ShallowWrapper
  let onClick: jest.Mock
  let done: jest.Mock

  beforeEach(() => {
    onClick = jest.fn()
    transitionButton = shallow(
      <TransitionButton
        text='Button'
        successText='Success!'
        loadingText='loading...'
        type='button'
        onClick={onClick}
      />,
    )
  })

  it('should render a Button component with correct text', () => {
    expect(transitionButton.find(Button).childAt(0).text()).toBe('Button')
  })

  it('should render a Button component with correct successText', () => {
    expect(transitionButton.find(Button).childAt(1).text()).toBe('Success!')
  })

  it('should render a Button component with correct loadingText', () => {
    expect(transitionButton.find(Button).childAt(2).text()).toBe('loading...')
  })

  describe('text only transition button', () => {
    describe('when clicked', () => {
      beforeEach(() => {
        (transitionButton.instance() as TransitionButton).animateSuccess(false)
        transitionButton.find(Button).prop('onClick')()
        jest.runAllTimers()
      })

      it('should invoke the onClick callback', () => {
        expect(onClick).toHaveBeenCalled()
      })

      it('should apply a transition to the text', () => {
        expect(transitionButton.state('textTransition')).toBe(TRANSITION_CLASSES.TEXT_IN)
      })

      it('should apply a transition to the success text', () => {
        expect(transitionButton.state('successTextTransition')).toBe(TRANSITION_CLASSES.TEXT_OUT)
      })
    })
  })

  describe('text and color transition button', () => {
    beforeEach(() => {
      done = jest.fn()
      transitionButton = shallow(
        <TransitionButton
          text='Button'
          successText='Success!'
          type='button'
          onClick={onClick}
        />
      )
    })

    describe('when clicked', () => {
      beforeEach(() => {
        (transitionButton.instance() as TransitionButton).animateSuccess(true, done)
        transitionButton.find(Button).prop('onClick')()
        jest.runAllTimers()
      })

      it('should invoke the onClick callback', () => {
        expect(onClick).toHaveBeenCalled()
      })

      it('should invoke done callback when animation ends', () => {
        expect(done).toHaveBeenCalled()
      })

      it('should apply a transition to the text', () => {
        expect(transitionButton.state('textTransition')).toBe(TRANSITION_CLASSES.TEXT_IN)
      })

      it('should apply a transition to the success text', () => {
        expect(transitionButton.state('successTextTransition')).toBe(TRANSITION_CLASSES.TEXT_OUT)
      })

      it('should apply a transition to the button color', () => {
        expect(transitionButton.state('colorTransition')).toBe(TRANSITION_CLASSES.SUCCESS_COLOR_OUT)
      })
    })
  })

  describe('loading text transition button', () => {
    beforeEach(() => {
      done = jest.fn()
      transitionButton = shallow(
        <TransitionButton
          text='Button'
          successText='Success!'
          loadingText='loading...'
          type='button'
          onClick={onClick}
        />
      )
    })

    describe('when clicked', () => {
      beforeEach(() => {
        transitionButton.find(Button).prop('onClick')()
      })

      it('should invoke the onClick callback', () => {
        expect(onClick).toHaveBeenCalled()
      })

      it('should invoke the done callback when animation ends', () => {
        (transitionButton.instance() as TransitionButton).animateLoading(done)
        jest.runAllTimers()
        expect(done).toHaveBeenCalled()
      })

      it('should not invoke the done callback if it is undefined', () => {
        (transitionButton.instance() as TransitionButton).animateLoading()
        jest.runAllTimers()
        expect(done).not.toHaveBeenCalled()
      })

      it('should apply a transition to the text', () => {
        (transitionButton.instance() as TransitionButton).animateLoading(done)
        jest.runAllTimers()
        expect(transitionButton.state('textTransition')).toBe(TRANSITION_CLASSES.TEXT_OUT)
      })

      it('should apply a transition to the loading text', () => {
        (transitionButton.instance() as TransitionButton).animateLoading(done)
        jest.runAllTimers()
        expect(transitionButton.state('loadingTextTransition')).toBe(TRANSITION_CLASSES.TEXT_IN)
      })
    })
  })

  describe('error text transition button', () => {
    beforeEach(() => {
      done = jest.fn()
      transitionButton = shallow(
        <TransitionButton
          text='Button'
          successText='Success!'
          loadingText='loading...'
          errorText='Failed'
          type='button'
          onClick={onClick}
        />
      )
    })

    describe('when clicked', () => {
      beforeEach(() => {
        transitionButton.find(Button).prop('onClick')()
      })

      it('should invoke the onClick callback', () => {
        expect(onClick).toHaveBeenCalled()
      })

      it('should invoke the done callback when animation ends', () => {
        (transitionButton.instance() as TransitionButton).animateError(done)
        jest.runAllTimers()
        expect(done).toHaveBeenCalled()
      })

      it('should not invoke the done callback if it is undefined', () => {
        (transitionButton.instance() as TransitionButton).animateError()
        jest.runAllTimers()
        expect(done).not.toHaveBeenCalled()
      })

      it('should apply a transition to the text', () => {
        (transitionButton.instance() as TransitionButton).animateError(done)
        jest.runAllTimers()
        expect(transitionButton.state('textTransition')).toBe(TRANSITION_CLASSES.TEXT_IN)
      })

      it('should apply a transition to the error text', () => {
        (transitionButton.instance() as TransitionButton).animateError(done)
        jest.runAllTimers()
        expect(transitionButton.state('errorTextTransition')).toBe(TRANSITION_CLASSES.TEXT_OUT)
      })

      it('should apply a transition to the error color', () => {
        (transitionButton.instance() as TransitionButton).animateError(done)
        jest.runAllTimers()
        expect(transitionButton.state('colorTransition')).toBe(TRANSITION_CLASSES.ERROR_COLOR_OUT)
      })
    })
  })
})
