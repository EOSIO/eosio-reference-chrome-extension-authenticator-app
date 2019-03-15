import * as React from 'react'
import './TransitionButton.css'

import Button, { HTMLButtonType } from 'components/shared/button/Button'

const ANIMATION_TIMEOUT = 1500
const ANIMATION_DONE_TIMEOUT = 500

export const TRANSITION_CLASSES = {
  TEXT_IN: 'transition-button-text-in',
  TEXT_OUT: 'transition-button-text-out',
  SUCCESS_COLOR_IN: 'transition-button-success-color-in',
  SUCCESS_COLOR_OUT: 'transition-button-success-color-out',
  ERROR_COLOR_IN: 'transition-button-error-color-in',
  ERROR_COLOR_OUT: 'transition-button-error-color-out',
}

interface State {
  textTransition: string
  successTextTransition: string
  loadingTextTransition: string
  errorTextTransition: string
  colorTransition: string
}

interface Props {
  text: string
  successText: string
  loadingText?: string
  errorText?: string
  type: HTMLButtonType
  secondaryStyle?: boolean
  borderedStyle?: boolean
  disabled?: boolean
  onClick?: () => void
  id?: string
}

const defaultProps: Props = {
  text: '',
  successText: '',
  type: 'button',
  secondaryStyle: false,
  borderedStyle: false,
  disabled: false,
}

export default class TransitionButton extends React.Component<Props, State> {
  public static displayName = 'TransitionButton'
  public static defaultProps = defaultProps

  public state: State = {
    textTransition: '',
    successTextTransition: '',
    loadingTextTransition: '',
    errorTextTransition: '',
    colorTransition: '',
  }

  public render() {
    const {
      text,
      successText,
      loadingText,
      errorText,
      type,
      onClick,
      secondaryStyle,
      borderedStyle,
      disabled,
      id
    } = this.props

    return (
      <div className={this.state.colorTransition}>
        <Button
          type={type}
          onClick={onClick}
          secondaryStyle={secondaryStyle}
          borderedStyle={borderedStyle}
          disabled={disabled}
          id={id}
        >
          <span className={this.state.textTransition}>{text}</span>
          <span className={`transition-button-success-text ${this.state.successTextTransition}`}>{successText}</span>
          <span className={`transition-button-loading-text ${this.state.loadingTextTransition}`}>{loadingText}</span>
          <span className={`transition-button-error-text ${this.state.errorTextTransition}`}>{errorText}</span>
        </Button>
      </div>
    )
  }

  public animateLoading = (done?: () => void) => {
    this.setState({
      textTransition: TRANSITION_CLASSES.TEXT_OUT,
      loadingTextTransition: TRANSITION_CLASSES.TEXT_IN,
    })

    if (done) {
      setTimeout(() => done(), ANIMATION_DONE_TIMEOUT)
    }
  }

  public animateSuccess = (transitionColor: boolean, done?: () => void) => {
    const { loadingTextTransition } = this.state

    const successColorTransitionIn = transitionColor ? TRANSITION_CLASSES.SUCCESS_COLOR_IN : ''
    const successColorTransitionOut = transitionColor ? TRANSITION_CLASSES.SUCCESS_COLOR_OUT : ''

    if (loadingTextTransition === TRANSITION_CLASSES.TEXT_IN) {
      this.setState({
        loadingTextTransition: TRANSITION_CLASSES.TEXT_OUT,
        successTextTransition: TRANSITION_CLASSES.TEXT_IN,
        colorTransition: successColorTransitionIn,
      })
    } else {
      this.setState({
        textTransition: TRANSITION_CLASSES.TEXT_OUT,
        successTextTransition: TRANSITION_CLASSES.TEXT_IN,
        colorTransition: successColorTransitionIn,
      })
    }

    setTimeout(() => {
      this.setState({
        textTransition: TRANSITION_CLASSES.TEXT_IN,
        successTextTransition: TRANSITION_CLASSES.TEXT_OUT,
        colorTransition: successColorTransitionOut,
      })

      if (done) {
        setTimeout(() => done(), ANIMATION_DONE_TIMEOUT)
      }

    }, ANIMATION_TIMEOUT)
  }

  public animateError = (done?: () => void) => {
    const { loadingTextTransition } = this.state

    if (loadingTextTransition === TRANSITION_CLASSES.TEXT_IN) {
      this.setState({
        loadingTextTransition: TRANSITION_CLASSES.TEXT_OUT,
        errorTextTransition: TRANSITION_CLASSES.TEXT_IN,
        colorTransition: TRANSITION_CLASSES.ERROR_COLOR_IN,
      })
    } else {
      this.setState({
        textTransition: TRANSITION_CLASSES.TEXT_OUT,
        errorTextTransition: TRANSITION_CLASSES.TEXT_IN,
        colorTransition: TRANSITION_CLASSES.ERROR_COLOR_IN,
      })
    }

    setTimeout(() => {
      this.setState({
        textTransition: TRANSITION_CLASSES.TEXT_IN,
        errorTextTransition: TRANSITION_CLASSES.TEXT_OUT,
        colorTransition: TRANSITION_CLASSES.ERROR_COLOR_OUT,
      })

      if (done) {
        setTimeout(() => done(), ANIMATION_DONE_TIMEOUT)
      }
    }, ANIMATION_TIMEOUT)

  }
}
