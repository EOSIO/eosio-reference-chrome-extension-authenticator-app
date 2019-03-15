import * as React from 'react'
import './SelectiveDisclosureView.css'

import FooterView from 'components/shared/layout/FooterView'
import Button from 'components/shared/button/Button'

interface Props {
  dappName: string
  dappIcon: any
  dappDeclaredDomain: string
  onDeny: () => void
  onAccept: () => void
}

const SelectiveDisclosureView: React.SFC<Props> = (props: Props) => (
  <div className='disclosure-container'>
    <div className='disclosure-content'>
      <h1 className='disclosure-title'>Allow {props.dappName} to log in?</h1>
      <img className='disclosure-icon' src={props.dappIcon} alt='requesting-app-icon' />
      <p className='disclosure-domain-label'>Domain Requesting</p>
      <h2 className='disclosure-domain-name'>{props.dappDeclaredDomain}</h2>
      <FooterView>
        <Button
          type='button'
          secondaryStyle
          onClick={props.onDeny}
        >
          Deny
        </Button>
        <Button
          type='button'
          onClick={props.onAccept}
        >
          Accept
        </Button>
      </FooterView>
    </div>
  </div>
)

SelectiveDisclosureView.displayName = 'SelectiveDisclosureView'
export default SelectiveDisclosureView
