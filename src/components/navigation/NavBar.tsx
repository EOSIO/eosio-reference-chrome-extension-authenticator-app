import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { MemoryHistory } from 'history'
import './NavBar.css'

import RoutePath from 'constants/routePath'
import backImage from 'assets/images/chevron-left.svg'
import settingsIcon from 'assets/images/settings-icon.svg'

export type ButtonAction = RoutePath | (() => void)

export interface ButtonProps {
  imageSrc: string
  action: ButtonAction
}

export const settingsButton: ButtonProps = {
  imageSrc: settingsIcon,
  action: () => window.open(chrome.runtime.getURL('index.html#options')),
}

export interface Props extends RouteComponentProps {
  renderLogo?: boolean
  rightButton?: ButtonProps
  history: MemoryHistory
}

export const NavBar: React.SFC<Props> = ({
  renderLogo,
  rightButton,
  history,
}) => {
  const renderBackButton = () => {
    if (history.index <= 0) {
      return null
    }

    return renderButton({
      imageSrc: backImage,
      action: () => {
        history.goBack()
      },
    })
  }

  const renderButton = (buttonProps: ButtonProps) => {
    return buttonProps && (
      <img
        src={buttonProps.imageSrc}
        className='nav-button'
        onClick={() => onButtonAction(buttonProps.action)}
        alt='nav'
      />
    )
  }

  const onButtonAction = (action: ButtonAction) => {
    if (isString(action)) {
      history.push(action)
    } else {
      action()
    }
  }

  const renderLeftIcon = () => {
    if (renderLogo) {
      return <h1 className='navbar-logo'>EOSIO Reference Authenticator</h1>
    } else {
      return renderBackButton()
    }
  }

  return (
    <div className='navbar-container'>
      <div className='navbar-content'>
        <div className='navbar-left'>
          {renderLeftIcon()}
        </div>
        <div className='navbar-right'>
          {renderButton(rightButton)}
        </div>
      </div>
    </div>
  )
}

function isString(test: any): test is string {
  return typeof test === 'string'
}

NavBar.displayName = 'NavBar'
export default withRouter(NavBar)
