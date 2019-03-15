import * as React from 'react'
import './ErrorView.css'

import NavBar, { settingsButton } from 'components/navigation/NavBar'
import FooterView from 'components/shared/layout/FooterView'
import Button from 'components/shared/button/Button'
import somethingsNotRightImage from 'assets/images/somethings-not-right.svg'

interface Props {
  error: string
  onBackToAuths: () => void
}

const ErrorView: React.SFC<Props> = ({ error, onBackToAuths }) => (
  <React.Fragment>
    <NavBar
      rightButton={settingsButton}
      renderLogo
    />

    <div className='error-container'>
      <img src={somethingsNotRightImage}/>
      <h1 className='error'>Something’s Not Right</h1>
      <p>The app you’re trying to interact with is not configured correctly.</p>
      <p className='error-description'>{error}</p>
    </div>

    <FooterView>
      <Button
        type='button'
        onClick={onBackToAuths}
      >
        Back to My Auths
      </Button>
    </FooterView>
  </React.Fragment>
)

ErrorView.displayName = 'ErrorView'

export default ErrorView
