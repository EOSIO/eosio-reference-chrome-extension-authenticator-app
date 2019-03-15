import * as React from 'react'
import classNames from 'classnames'

import './FloatingInput.css'
import showPassphraseIcon from 'assets/images/show-passphrase.svg'
import hidePassphraseIcon from 'assets/images/hide-passphrase.svg'

type inputType = 'text' | 'password'

interface Props {
  placeholder: string
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  inputType?: inputType
  value?: string
  error?: string
  toggleablePassword?: boolean
  disabled?: boolean
  className?: string
  id?: string
}

interface State {
  show: boolean
}

export default class FloatingInput extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    inputType: 'text',
    error: '',
    toggleablePassword: false,
    disabled: false,
  }

  public state: State = {
    show: false,
  }

  public render() {
    const { error, placeholder, toggleablePassword, className } = this.props
    const borderClassName = classNames({ 'floating-input-error-border': error, 'floating-input-border': !error })
    const containerClassName = classNames('floating-input-container', [className])
    const input = toggleablePassword ? this.renderToggleableInput() : this.renderNonToggleableInput()

    return (
      <div className={containerClassName}>
        <label className='input-label' htmlFor='placeholderLabel'>{placeholder}</label>
        <div className={borderClassName}>
          {input}
        </div>
        <span className='floating-input-error-text'>{error}</span>
      </div>
    )
  }

  private renderNonToggleableInput = () => {
    return (
      <input
        type={this.props.inputType}
        placeholder={this.props.placeholder}
        autoFocus
        disabled={this.props.disabled}
        onChange={this.props.onInput}
        value={this.props.value}
        id={this.props.id}
      />
    )
  }

  private renderToggleableInput = () => {
    const type = this.state.show ? 'text' : 'password'

    return (
      <React.Fragment>
        <input
          type={type}
          placeholder={this.props.placeholder}
          autoFocus
          disabled={this.props.disabled}
          onChange={this.props.onInput}
          value={this.props.value}
          id={this.props.id}
        />
        <img
          src={this.state.show ? hidePassphraseIcon : showPassphraseIcon}
          alt='showPassphrase'
          onClick={this.showPassphraseOnClick}
        />
      </React.Fragment>
    )
  }

  private showPassphraseOnClick = () => {
    this.setState((prevState: State) => ({ show: !prevState.show }))
  }
}
