import * as React from 'react'
import classNames from 'classnames'

export type HTMLButtonType = 'submit' | 'reset' | 'button'

export interface Props {
  type: HTMLButtonType
  secondaryStyle?: boolean
  borderedStyle?: boolean
  disabled?: boolean
  onClick?: () => void
  id?: string
}

const defaultProps: Props = {
  type: 'button',
  secondaryStyle: false,
  borderedStyle: false,
  disabled: false,
}

const Button: React.SFC<Props> = ({
  children,
  type,
  onClick,
  secondaryStyle,
  borderedStyle,
  disabled,
  id,
}) => {
  const buttonClassName = classNames({ secondary: secondaryStyle, bordered: borderedStyle })

  const renderContent = () => (
    <div className='button-text'>
      {children}
    </div>
  )

  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
    >
      {renderContent()}
    </button>
  )
}

Button.defaultProps = defaultProps

Button.displayName = 'Button'

export default Button
